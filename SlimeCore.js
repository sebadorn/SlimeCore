'use strict';


var SlimeCore = {


	CONFIG: {
		'controls.gamepad.deadzone': 0.1
	},


	// All files of the SlimeCore library
	// in correct loading order.
	FILES_ALL: [
		'Utils',
		'Controls',
		'Controls.Controller',
		'Controls.Gamepad',
		'Controls.Keyboard',
		'Grid2D',
		'Math',
		'PixiRenderer',
		'ThreeRenderer'
	],


	// Default logger. Can be replaced by own object.
	log: window.console,


	_basePath: 'SlimeCore/',


	/**
	 * Get the base path for library files.
	 * @return {String}
	 */
	get basePath() {
		return this._basePath;
	},


	/**
	 * Set the base path for library files.
	 * @param  {String} value
	 * @return {String}
	 */
	set basePath( value ) {
		this._basePath = String( value );
		var bp = this._basePath;

		if( bp.length > 0 && bp[bp.length - 1] !== '/' ) {
			this._basePath += '/';
		}

		return this._basePath;
	},


	/**
	 * Load a JavaScript file.
	 * @param {Number}        i     Next file to load.
	 * @param {Array<String>} files List of requested files.
	 * @param {Function}      cb    Final callback.
	 */
	_loadJavaScriptFile( i, files, cb ) {
		if( i >= files.length ) {
			cb && cb( null );
			return;
		}

		var filePath = files[i];
		var s = document.createElement( 'script' );

		s.onload = () => {
			SlimeCore._loadJavaScriptFile( i + 1, files, cb );
		};

		s.onerror = () => {
			var err = new Error( 'Failed to load file: ' + filePath );
			SlimeCore.log.error( '[SlimeCore._loadJavaScriptFile] ' + err.message );
			cb && cb( err );
		};

		s.src = filePath;

		document.head.appendChild( s );
	},


	/**
	 * Load a library file.
	 * @param {Number}        i     Next file to load.
	 * @param {Array<String>} files List of requested files.
	 * @param {Function}      cb    Final callback.
	 */
	_loadLibraryFile( i, files, cb ) {
		if( i >= files.length ) {
			cb && cb( null );
			return;
		}

		var filePath = this.basePath + files[i] + '.js';
		var s = document.createElement( 'script' );

		s.onload = () => {
			SlimeCore._loadLibraryFile( i + 1, files, cb );
		};

		s.onerror = () => {
			var err = new Error( 'Failed to load file: ' + filePath );
			SlimeCore.log.error( '[SlimeCore._loadLibraryFile] ' + err.message );
			cb && cb( err );
		};

		s.src = filePath;

		document.head.appendChild( s );
	},


	/**
	 * Generate a UUID.
	 * @see http://stackoverflow.com/a/2117523/915570
	 * @return {String}
	 */
	generateUUID() {
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

		uuid = uuid.replace( /[xy]/g, ( c ) => {
			var r = Math.random() * 16 | 0;
			var v = ( c == 'x' ) ? r : ( r & 0x3 | 0x8 );

			return v.toString( 16 );
		} );

		return uuid;
	},


	/**
	 * Load a list of JavaScript files.
	 * @param  {String}        basePath
	 * @param  {Array<String>} files
	 * @param  {Function}      cb       Final callback.
	 */
	loadJavaScriptFiles( basePath, files, cb ) {
		if( typeof basePath === 'string' ) {
			files = files.map( ( a ) => basePath + a );
		}

		this._loadJavaScriptFile( 0, files, cb );
	},


	/**
	 * Load all requested SlimeCore library files.
	 * @param {Array<String>|Function} files A list of library files or the callback function.
	 *                                       If the later, the second argument will be ignored.
	 * @param {Function}               cb    Callback.
	 */
	loadLibraryFiles( files, cb ) {
		if( typeof files === 'function' ) {
			cb = files;
			files = this.FILES_ALL;
		}

		// The "Utils.js" is required.
		if( files.indexOf( 'Utils' ) < 0 ) {
			files.splice( 0, 0, 'Utils' );
		}

		this._loadLibraryFile( 0, files, cb );
	}


};
