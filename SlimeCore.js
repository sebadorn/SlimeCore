'use strict';


/**
 * @namespace Slimecore
 */
const SlimeCore = {


	ERROR: {
		NONE: 0,
		FILE_LOAD: 1,
		FILE_PARSE: 2
	},

	VERSION: '0.1',


	// Callback hooks.
	onRequestExit: null,


	/**
	 * Try to exit the application.
	 * @param {number} errorCode - Error code.
	 */
	exit( errorCode ) {
		if( typeof SlimeCore.onRequestExit === 'function' ) {
			SlimeCore.onRequestExit( errorCode );
		}
	}


};
