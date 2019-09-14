'use strict';


/**
 * @namespace SlimeCore.Config
 */
SlimeCore.Config = {


	_cfg: null,


	/**
	 * Get the config value for the given key.
	 * @param  {string} key - Config key to a value.
	 * @return {*} The config value or undefined if not found.
	 */
	get( key ) {
		return this._cfg[key];
	},


	/**
	 * Get the config value for the given key. If it is an object,
	 * a copy will of the object will be returned.
	 * @param  {string} key - Config key to a value.
	 * @return {*} The config value or undefined if not found.
	 */
	getCopy( key ) {
		let val = this._cfg[key];

		if( SlimeCore.Utils.isObject( val ) ) {
			val = JSON.parse( JSON.stringify( val ) );
		}

		return val;
	},


	/**
	 * Load a config file.
	 * @param  {string} filepath - File path of the config file (written in JSON format.)
	 * @return {number} Error code.
	 *     0: Good.
	 *     1: Error on reading file.
	 *     2: Error on parsing file.
	 */
	load( filepath ) {
		let data = null;

		try {
			data = SlimeCore.Utils.loadAndParseJSONFile( filepath );
		}
		catch( errorCode ) {
			return errorCode;
		}

		this._cfg = data;

		return SlimeCore.ERROR.NONE;
	}


};
