'use strict';


/**
 * Utility functions.
 */
SlimeCore.Utils = {


	/**
	 * Check if the given value is an object, but not null.
	 * @param  {mixed}   o
	 * @return {Boolean}
	 */
	isObject( o ) {
		return ( typeof o === 'object' && o !== null );
	}


};
