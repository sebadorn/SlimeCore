'use strict';


{

class SlimeCore_Controls_Keyboard extends SlimeCore.Controls.Controller {


	/**
	 * Keyboard.
	 * @constructor
	 * @extends {SlimeCore.Controls.Controller}
	 */
	constructor() {
		super();

		this.type = SlimeCore.Controls.TYPE.KEYBOARD;
		this._keyStateDown = {};
		this._initHandler();
	}


	/**
	 * Initialize keyboard listeners.
	 * @private
	 */
	_initHandler() {
		document.body.addEventListener( 'keydown', this._trackKeyEvents.bind( this ) );
		document.body.addEventListener( 'keyup', this._trackKeyEvents.bind( this ) );
	}


	/**
	 * Track key events.
	 * @private
	 * @param {KeyboardEvent} ev
	 */
	_trackKeyEvents( ev ) {
		if( ev.type === 'keydown' ) {
			this._keyStateDown[ev.keyCode] = Date.now();
		}
		else if( ev.type === 'keyup' ) {
			delete this._keyStateDown[ev.keyCode];
		}
	}


	/**
	 * Delete a key state.
	 * @param {number} keyCode
	 */
	deleteKeyState( keyCode ) {
		delete this._keyStateDown[keyCode];
	}


	/**
	 * Get pressed directions represented by a value [0.0, 1.0].
	 * Keyboards only support 0: not pressed and 1: pressed.
	 * @override
	 * @return {object}
	 */
	getDirections() {
		let dir = {
			down: Number( this.isPressedDown() ),
			left: Number( this.isPressedLeft() ),
			right: Number( this.isPressedRight() ),
			up: Number( this.isPressedUp() ),
			x: 0,
			y: 0
		};

		dir.x = dir.right - dir.left;
		dir.y = dir.down - dir.up;

		return dir;
	}


	/**
	 * Check if a certain key is currently pressed.
	 * @param  {(number|number[])} keyCode
	 * @param  {object}            flags
	 * @return {boolean}
	 */
	isPressed( keyCode, flags ) {
		if( Array.isArray( keyCode ) ) {
			for( let i = 0; i < keyCode.length; i++ ) {
				if( this.isPressed( keyCode[i], flags ) ) {
					return true;
				}
			}

			return false;
		}

		let isPressed = ( typeof this._keyStateDown[keyCode] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( keyCode );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for moving down is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedDown( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.ARROW_DOWN] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.ARROW_DOWN );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for moving left is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedLeft( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.ARROW_LEFT] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.ARROW_LEFT );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for selecting the next option is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedNext( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.S] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.S );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for selecting the previous option is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedPrevious( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.W] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.W );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for moving right is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedRight( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.ARROW_RIGHT] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.ARROW_RIGHT );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for selecting the option is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedSelect( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.E] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.E );
		}

		return isPressed;
	}


	/**
	 * Check, if the key for moving up is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedUp( flags ) {
		const KEY = SlimeCore.Controls.Keyboard.KEY;
		let isPressed = ( typeof this._keyStateDown[KEY.ARROW_UP] !== 'undefined' );

		if( flags && flags.forget ) {
			this.deleteKeyState( KEY.ARROW_UP );
		}

		return isPressed;
	}


}


SlimeCore_Controls_Keyboard.KEY = {
	ARROW_DOWN: 40,
	ARROW_LEFT: 37,
	ARROW_RIGHT: 39,
	ARROW_UP: 38,

	ALT: 18,
	ALTGR: 225,
	BACKSPACE: 8,
	CAPSLOCK: 20,
	CTRL: 17,
	ESCAPE: 27,
	ENTER: 13,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	MOD: 224,
	NUM_LOCK: 144,
	SHIFT: 16,
	SPACE: 32,
	TAB: 9,

	COMMA: 188,
	PERIOD: 190,

	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,

	NUM0: 48,
	NUM1: 49,
	NUM2: 50,
	NUM3: 51,
	NUM4: 52,
	NUM5: 53,
	NUM6: 54,
	NUM7: 55,
	NUM8: 56,
	NUM9: 57,

	NUMPAD0: 96,
	NUMPAD1: 97,
	NUMPAD2: 98,
	NUMPAD3: 99,
	NUMPAD4: 100,
	NUMPAD5: 101,
	NUMPAD6: 102,
	NUMPAD7: 103,
	NUMPAD8: 104,
	NUMPAD9: 105
};

SlimeCore.Controls.Keyboard = SlimeCore_Controls_Keyboard;

}
