'use strict';


{

/**
 * @alias SlimeCore.Controls.Gamepad.DS4
 */
class SlimeCore_Controls_Gamepad_DS4 {


	/**
	 *
	 * @alias SlimeCore.Controls.Gamepad.DS4
	 * @class
	 * @param {HidDeviceInfo} device
	 */
	constructor( device ) {
		this._connection = null;
		this._device = device;
	}


	/**
	 * Connect the device.
	 * @param {?function} cb - Callback.
	 */
	connect( cb ) {
		let err = null;

		if( !this._device ) {
			err = new Error( 'No device info set.' );
			SlimeCore.Log.error( `[${LOG_TAG}.connect] ` + err.message );
			cb && cb( err );

			return;
		}

		let deviceId = this._device.deviceId;

		chrome.hid.connect( deviceId, ( connection ) => {
			this._connection = connection || null;

			if( chrome.runtime.lastError ) {
				err = chrome.runtime.lastError;
				SlimeCore.Log.error( `[${LOG_TAG}.connect] ` + err.message );
			}

			if( !err ) {
				SlimeCore.Log.log( `[${LOG_TAG}.connect]` +
					` Established a connection for device ${deviceId}` +
					` with connection ID ${connection.connectionId}.` );
			}

			cb && cb( err );
		});
	}


	/**
	 * Disconnect the device.
	 * @param {?function} cb - Callback.
	 */
	disconnect( cb ) {
		let err = null;

		if( !this._connection ) {
			cb && cb( err );
			return;
		}

		let id = this._connection.connectionId;

		chrome.hid.disconnect( id, () => {
			this._connection = null;

			SlimeCore.Log.log( `[${LOG_TAG}.disconnect]` +
				` Device ID ${this._device.deviceId}, connection ID ${id}.` );

			if( chrome.runtime.lastError ) {
				err = new Error( chrome.runtime.lastError );
				SlimeCore.Log.error( `[${LOG_TAG}.disconnect] ` + err.message );
			}

			cb && cb( err );
		});
	}


	/**
	 * Send output to the devices.
	 * @see https://github.com/ehd/node-ds4
	 * @param {object} options
	 * @param {?function} cb - Callback.
	 */
	set( options, cb ) {
		let err = null;

		if( !this._connection ) {
			err = new Error( 'No connection.' );
			SlimeCore.Log.error( `[${LOG_TAG}.set] ` + err.message );
			cb && cb( err );

			return;
		}

		let connId = this._connection.connectionId;
		let data = new Uint8Array( 10 );
		let i = 0;

		//  Unchanging.
		data[i++] = 0xFF;
		data[i++] = 0x04;
		data[i++] = 0x00;

		// Effects.
		data[i++] = options.rumbleRight || 0; // [0, 255]
		data[i++] = options.rumbleLeft || 0; // [0, 255]
		data[i++] = options.r || 0; // [0, 255]
		data[i++] = options.g || 0; // [0, 255]
		data[i++] = options.b || 0; // [0, 255]
		data[i++] = options.flashOn || 0; // [0, 255]
		data[i++] = options.flashOff || 0; // [0, 255]

		chrome.hid.send( connId, CONSTANTS.REPORT_ID, data.buffer, () => {
			if( chrome.runtime.lastError ) {
				err = new Error( chrome.runtime.lastError );
				SlimeCore.Log.error( `[${LOG_TAG}.send] ` + err.message );
			}

			cb && cb( err );
		} );
	}


}


SlimeCore_Controls_Gamepad_DS4._devices = {};


/**
 * Find devices.
 * @param {Function} cb Callback.
 */
SlimeCore_Controls_Gamepad_DS4.find = function( cb ) {
	chrome.hid.getDevices( DEVICE_FILTER, ( devices ) => {
		let err = null;

		if( chrome.runtime.lastError ) {
			err = new Error( chrome.runtime.lastError );
			SlimeCore.Log.error( `[${LOG_TAG}.find] ` + err.message );
			devices = [];
		}
		else if( !Array.isArray( devices ) ) {
			err = new Error( 'Result is not an array.' );
			SlimeCore.Log.error( `[${LOG_TAG}.find] ` + err.message );
			devices = [];
		}

		let result = [];

		for( let i = 0; i < devices.length; i++ ) {
			let d = devices[i];
			let known = this._devices[d.deviceId];

			if( known ) {
				result.push( known );
			}
			else {
				let ds4 = new SlimeCore_Controls_Gamepad_DS4( d );
				result.push( ds4 );

				this._devices[d.deviceId] = ds4;
			}
		}

		cb && cb( err, result );
	} );
};


const CONSTANTS = {
	REPORT_ID: 5,

	// @see https://wiki.gentoo.org/wiki/Sony_DualShock
	PRODUCT_ID_DS3: [
		616 // 0x0268
	],
	PRODUCT_ID_DS4: [
		1476, // 0x05C4, 1st generation model
		2508 // 0x09CC, 2nd generation model
	],
	VENDOR_ID: 1356 // 0x054C
};

SlimeCore_Controls_Gamepad_DS4.CONSTANTS = CONSTANTS;

const LOG_TAG = 'SlimeCore.Controls.Gamepad.DS4';


// Build the device filter for chrome.hid.getDevices().

const DEVICE_FILTER = {
	filters: []
};

for( let i = 0; i < CONSTANTS.PRODUCT_ID_DS4.length; i++ ) {
	let id = CONSTANTS.PRODUCT_ID_DS4[i];

	DEVICE_FILTER.filters.push( {
		vendorId: CONSTANTS.VENDOR_ID,
		productId: id
	} );
}


if( typeof chrome === 'undefined' ) {
	SlimeCore.Log.warn( '[SlimeCore.Controls.Gamepad.DS4]' +
		' No chrome API. DS4 class will not be available.' );
}
else if( typeof chrome.hid === 'undefined' ) {
	SlimeCore.Log.warn( '[SlimeCore.Controls.Gamepad.DS4]' +
		' No chrome.hid API. DS4 class will not be available.' );
}
else {
	SlimeCore.Controls.Gamepad.DS4 = SlimeCore_Controls_Gamepad_DS4;
}


}
