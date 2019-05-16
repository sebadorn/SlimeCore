'use strict';


/**
 * Utility functions.
 * @namespace SlimeCore.Utils
 */
SlimeCore.Utils = {


	/**
	 * Create a combined deep copy of all passed objects.
	 * Does not support classes or functions!
	 * @param  {...object} o - An object.
	 * @return {object}
	 */
	deepCopy( o ) {
		let copy = {};

		for( let i = 0; i < arguments.length; i++ ) {
			let arg = arguments[i];

			if( !this.isObject( arg ) ) {
				continue;
			}

			for( let key in arg ) {
				if( !arg.hasOwnProperty( key ) ) {
					continue;
				}

				let val = arg[key];
				copy[key] = this.isObject( val ) ? this.deepCopy( val ) : val;
			}
		}

		return copy;
	},


	/**
	 * Generate a UUID.
	 * @see https://stackoverflow.com/a/2117523/915570
	 * @return {string}
	 */
	generateUUID() {
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

		uuid = uuid.replace( /[xy]/g, ( c ) => {
			let r = Math.random() * 16 | 0;
			let v = ( c == 'x' ) ? r : ( r & 0x3 | 0x8 );

			return v.toString( 16 );
		} );

		return uuid;
	},


	/**
	 * Check if the given value is a number and not only by type.
	 * NOTE: "NaN" (Not-a-Number) is of type "number".
	 * @param  {*} n
	 * @return {boolean}
	 */
	isNumber( n ) {
		return ( typeof n === 'number' && !isNaN( n ) );
	},


	/**
	 * Check if the given value is an object and not null.
	 * @param  {*} o
	 * @return {boolean}
	 */
	isObject( o ) {
		return ( o !== null && typeof o === 'object' );
	},


	/**
	 * Load and parse a file with JSON content.
	 * @param  {string} filepath
	 * @return {*}
	 * @throws {number} If error on loading or parsing the file.
	 */
	loadAndParseJSONFile( filepath ) {
		const fs = require( 'fs' );
		const path = require( 'path' );
		const stripComments = require( 'strip-json-comments' );

		let readStr = null;
		let parsed = null;

		// Read file.
		try {
			readStr = String( fs.readFileSync( filepath ) );
		}
		catch( err ) {
			SlimeCore.Log.error( '[SlimeCore.Utils.loadAndParseJSONFile]' +
				` Filepath: "${filepath}". Error: ${err.message}` );
			throw SlimeCore.ERROR.FILE_LOAD;
		}

		// Parse file content.
		try {
			parsed = JSON.parse( stripComments( readStr ) );
		}
		catch( err ) {
			SlimeCore.Log.error( '[SlimeCore.Utils.loadAndParseJSONFile]' +
				` Failed to parse content. ${err.message}` );
			throw SlimeCore.ERROR.FILE_PARSE;
		}

		SlimeCore.Log.log( `[SlimeCore.Utils.loadAndParseJSONFile] Loaded file: "${filepath}"` );

		return parsed;
	},


	/**
	 * Load a script file.
	 * @param {string}   id       - ID for the script tag.
	 * @param {string}   filePath - File path.
	 * @param {function} cb       - Callback on successful loading.
	 */
	loadFile( id, filePath, cb ) {
		let script = document.createElement( 'script' );
		script.id = id.toLowerCase();

		script.onerror = ( ev ) => {
			SlimeCore.Log.error( `[SlimeCore.Utils.loadFile] Failed to load file: ${filePath}` );
			window.alert( `Failed to load file: ${filePath}` );

			SlimeCore.exit( SlimeCore.ERROR.FILE_LOAD );
		};

		script.onload = cb;
		script.src = filePath;

		document.head.appendChild( script );
	},


	/**
	 * Load multiple script files in a given order.
	 * @param {(string[]|object[])} list
	 * @param {function}            cb
	 */
	loadFiles( list, cb ) {
		let next = ( i ) => {
			if( i >= list.length ) {
				cb();
				return;
			}

			let item = list[i];
			let file = item;

			if( typeof item === 'string' ) {
				file = {
					id: item.toLowerCase().replace( /\/|\\/g, '_' ),
					path: item
				};
			}

			this.loadFile( file.id, file.path, () => next( i + 1 ) );
		};

		next( 0 );
	}


};
