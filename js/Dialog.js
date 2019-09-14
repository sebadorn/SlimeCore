'use strict';


{

/**
 * @alias SlimeCore.Dialog
 */
class SlimeCore_Dialog {


	/**
	 * Dialog system.
	 * @alias SlimeCore.Dialog
	 * @class
	 * @param {?object} data - Data to build the system from.
	 * @param {?function} onUpdate - Callback for when the view should be updated.
	 */
	constructor( data = null, onUpdate = null ) {
		this._data = null;
		this._onUpdate = null;

		if( typeof onUpdate === 'function' ) {
			this._onUpdate = onUpdate;
		}

		this.currentItem = null;
		this.currentMarked = null;

		if( data ) {
			this._initFromData( data );
		}
	}


	/**
	 *
	 * @private
	 * @param {object} data
	 */
	_initFromData( data ) {
		this._data = data;
		this.currentItem = data.begin_at;

		let options = this.getOptions();

		for( let key in options ) {
			this.currentMarked = key;
			break;
		}
	}


	/**
	 * Build a dialog system from a JSON file.
	 * @param  {string} fname - File name.
	 * @return {SlimeCore.ERROR} Error code.
	 */
	fromFile( fname ) {
		const path = require( 'path' );

		let fpath = path.join( 'assets', 'texts', fname );
		let data = null;

		try {
			data = SlimeCore.Utils.loadAndParseJSONFile( fpath );
		}
		catch( errorCode ) {
			return errorCode;
		}

		this._initFromData( data );

		return SlimeCore.ERROR.NONE;
	}


	/**
	 * Get the current dialog options.
	 * @return {?object[]}
	 */
	getOptions() {
		return this._data.dialogs[this.currentItem].options || null;
	}


	/**
	 * Get the current display text.
	 * @return {?string}
	 */
	getText() {
		return this._data.dialogs[this.currentItem].text || null;
	}


	/**
	 * Mark the next option as potential selection.
	 */
	markNext() {
		let before = this.currentMarked;
		let options = this.getOptions();
		let keys = [];
		let current = 0;
		let i = 0;

		for( let key in options ) {
			keys.push( key );

			if( this.currentMarked == key ) {
				current = i;
			}

			i++;
		}

		let select = ( current + 1 ) % keys.length;
		this.currentMarked = keys[select];

		if( before != this.currentMarked ) {
			this.onUpdate && this.onUpdate();
		}
	}


	/**
	 * Mark the previous option as potential selection.
	 */
	markPrevious() {
		let before = this.currentMarked;
		let options = this.getOptions();
		let keys = [];
		let current = 0;
		let i = 0;

		for( let key in options ) {
			keys.push( key );

			if( this.currentMarked == key ) {
				current = i;
			}

			i++;
		}

		// In JavaScript this would happen: -1 % 3 = -1
		// We don't want a negative index.
		let select = ( current - 1 + keys.length ) % keys.length;
		this.currentMarked = keys[select];

		if( before != this.currentMarked ) {
			this.onUpdate && this.onUpdate();
		}
	}


	/**
	 * Reset the dialog progression.
	 */
	reset() {
		this.currentItem = null;
		this.currentMarked = null;
	}


	/**
	 * Select the marked option.
	 */
	selectMarked() {
		if( !this.currentMarked ) {
			return;
		}

		let options = this.getOptions();
		let result = options[this.currentMarked].result;

		// Go to another state in the dialog.
		if( result.type == 'goto' ) {
			this.currentItem = result.value;
			this.currentMarked = null;
		}
		// Trigger an event.
		else if( result.type == 'trigger' ) {
			// TODO: triggers
		}
	}


}


SlimeCore.Dialog = SlimeCore_Dialog;

}
