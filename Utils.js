'use strict';


/**
 * Utility functions.
 */
SlimeCore.Utils = {


	/**
	 * Extend a prototype.
	 * @see   http://www.2ality.com/2012/01/js-inheritance-by-example.html
	 * @param {Object} protoTarget
	 * @param {Object} extSource
	 */
	extend: function( protoTarget, extSource ) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;

		for( var propName in extSource ) {
			if( hasOwnProperty.call( extSource, propName ) ) {
				protoTarget[propName] = extSource[propName];
			}
		}
	},


	/**
	 * Check if the given value is an object, but not null.
	 * @param  {mixed}   o
	 * @return {Boolean}
	 */
	isObject: function( o ) {
		return ( typeof o === 'object' && o !== null );
	}


};
