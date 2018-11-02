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
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	getDirections() {
		throw new Error( '[SlimeCore.Controls.Controller.getDirection]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @param  {(number|number[])} key - Key or keys to check if pressed.
	 * @return {noolean} True, if any of the keys is pressed.
	 * @throw  {Error}
	 */
	isPressed( key ) {
		throw new Error( '[SlimeCore.Controls.Controller.isPressed]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedDown() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedDown]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedLeft() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedLeft]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedNext() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedNext]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedPrevious() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedPrevious]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedRight() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedRight]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedSelect() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedSelect]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Has to be implemented by extending class.
	 * @throw {Error}
	 */
	isPressedUp() {
		throw new Error( '[SlimeCore.Controls.Controller.isPressedUp]' +
			' Not implemented by extending class.' );
	}


}


SlimeCore.Controls.Controller = SlimeCore_Controls_Controller;

}
