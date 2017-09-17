'use strict';


{

class SlimeCore_Controls_Controller {


	/**
	 * Generic controller interface to be expanded.
	 * @constructor
	 */
	constructor() {
		//
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	getDirections() {
		throw new Error( '[SlimeCore.Controls.Controller.getDirection]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedDown() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedDown]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedLeft() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedLeft]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedNext() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedNext]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedPrevious() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedPrevious]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedRight() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedRight]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedSelect() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedSelect]' +
			' Not implemented by inheriting object.' );
	}


	/**
	 * Has to be implemented by inheriting object.
	 * @throw {Error}
	 */
	isPressedUp() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedUp]' +
			' Not implemented by inheriting object.' );
	}


}


SlimeCore_Controls_Controller.INTERACT = {
	DIALOG: 1,
	SPECIAL: 2,
	FIGHT: 3,
	SELECT: 4,

	SKILL_1: 50,
	SKILL_2: 51,
	SKILL_3: 52,
	SKILL_4: 53
};

SlimeCore.Controls.Controller = SlimeCore_Controls_Controller;

}
