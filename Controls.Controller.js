'use strict';


/**
 * Generic controller interface to be expanded.
 */
SlimeCore.Controls.Controller = function() {
	//
};


SlimeCore.Controls.Controller.INTERACT = {
	DIALOG: 1,
	SPECIAL: 2,
	FIGHT: 3,
	SELECT: 4,

	SKILL_1: 50,
	SKILL_2: 51,
	SKILL_3: 52,
	SKILL_4: 53
};


SlimeCore.Controls.Controller.prototype = {


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	getDirections: function() {
		throw new Error( '[SlimeCore.Controls.Controller.getDirection]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedDown: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedDown]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedLeft: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedLeft]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedNext: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedNext]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedPrevious: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedPrevious]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedRight: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedRight]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedSelect: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedSelect]' +
			' Not implemented by inheriting object.' );
	},


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedUp: function() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedUp]' +
			' Not implemented by inheriting object.' );
	}


};
