'use strict';


{

class SlimeCore_Controls_Gamepad extends SlimeCore.Controls.Controller {


	/**
	 * Gamepad.
	 * @constructor
	 * @extends {SlimeCore.Controls.Controller}
	 * @param   {Gamepad} gp
	 */
	constructor( gp ) {
		super();

		this.type = SlimeCore.Controls.TYPE.GAMEPAD;
		this._gamepadData = gp || null;
		this._ignoreUntilPressedAgain = {};

		// The Gamepad object attributes are
		// read-only so we keep a copy of the axes.
		this._axes = [0.0, 0.0, 0.0, 0.0];
	}


	/**
	 * Correct possible dead zones of a stick.
	 * (Loose sticks causing minor unwanted shaking.)
	 * @see http://www.third-helix.com/2013/04/12/doing-thumbstick-dead-zones-right.html
	 * @private
	 * @param {number} axesIndex - Starting index for the two axes. (0: left stick, 2: right stick)
	 */
	_correctStickDeadZone( axesIndex ) {
		let dz = SlimeCore.Config.get( 'controls.gamepad.deadzone' );

		if( !dz ) {
			return;
		}

		let len = Math.sqrt(
			this._axes[axesIndex] * this._axes[axesIndex] +
			this._axes[axesIndex + 1] * this._axes[axesIndex + 1]
		);

		if( len >= dz ) {
			this._axes[axesIndex] = 0.0;
			this._axes[axesIndex + 1] = 0.0;
		}
		else {
			let f = ( len - dz ) / ( 1 - dz );
			this._axes[axesIndex] = this._axes[axesIndex] / len * f;
			this._axes[axesIndex + 1] = this._axes[axesIndex + 1] / len * f;
		}
	}


	/**
	 * Get pressed directions represented by a value [0.0, 1.0].
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

		let stick = this.getStickLeft();

		if( stick.x < 0 ) {
			dir.left = -stick.x;
		}
		else if( stick.x > 0 ) {
			dir.right = stick.x;
		}

		if( stick.y < 0 ) {
			dir.up = -stick.y;
		}
		else if( stick.y > 0 ) {
			dir.down = stick.y;
		}

		dir.x = dir.right - dir.left;
		dir.y = dir.down - dir.up;

		return dir;
	}


	/**
	 * Get the position of the left stick.
	 * @return {object} Position (x, y).
	 */
	getStickLeft() {
		if( !this._gamepadData ) {
			return null;
		}

		return {
			x: this._axes[0],
			y: this._axes[1]
		};
	}


	/**
	 * Get the position of the right stick.
	 * @return {object} Position (x, y).
	 */
	getStickRight() {
		if( !this._gamepadData ) {
			return null;
		}

		return {
			x: this._axes[2],
			y: this._axes[3]
		};
	}


	/**
	 * Check, if the given button index is pressed.
	 * @param  {(number|number[])} button
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressed( button, flags ) {
		if( Array.isArray( button ) ) {
			for( let i = 0; i < button.length; i++ ) {
				if( this.isPressed( button[i], flags ) ) {
					return true;
				}
			}

			return false;
		}

		let isPressed = (
			this._gamepadData.buttons[button].pressed &&
			this._gamepadData.buttons[button].value
		);

		if( isPressed && this._ignoreUntilPressedAgain[button] ) {
			return false;
		}

		if( isPressed && flags && flags.forget ) {
			this._ignoreUntilPressedAgain[button] = true;
		}

		return isPressed;
	}


	/**
	 * Check, if the button for moving down is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedDown( flags ) {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.DPAD_DOWN, flags );
	}


	/**
	 * Check, if the button for moving left is pressed.
	 * @override
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedLeft() {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.DPAD_LEFT].pressed &&
			this._gamepadData.buttons[BUTTON.DPAD_LEFT].value
		);
	}


	/**
	 * Check, if the button for selecting the next option is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedPrevious( flags ) {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.PS_L1, flags );
	}


	/**
	 * Check, if the button for moving right is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedRight( flags ) {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.DPAD_RIGHT, flags );
	}


	/**
	 * Check, if the button for selecting the next option is pressed.
	 * @override
	 * @param  {object} flags
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedNext( flags ) {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.PS_R1, flags );
	}


	/**
	 * Check, if the button for selecting the option is pressed.
	 * @override
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedSelect() {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.PS_X].pressed &&
			this._gamepadData.buttons[BUTTON.PS_X].value
		);
	}


	/**
	 * Check, if the button for moving up is pressed.
	 * @override
	 * @return {boolean} True if pressed, false otherwise.
	 */
	isPressedUp() {
		const BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.DPAD_UP].pressed &&
			this._gamepadData.buttons[BUTTON.DPAD_UP].value
		);
	}


	/**
	 * Set the gamepad data.
	 * @param {Gamepad} gp
	 */
	setGamepadData( gp ) {
		this.updateButtonIgnoreStates();

		// No state changes, ignore.
		if( this._gamepadData && gp.timestamp == this._gamepadData.timestamp ) {
			return;
		}

		this._gamepadData = gp;
		this._axes = gp.axes.slice( 0 );
		this._correctStickDeadZone( 0 );
		this._correctStickDeadZone( 2 );
	}


	/**
	 * Reset the button ignore flags where necessary.
	 */
	updateButtonIgnoreStates() {
		if( !this._gamepadData ) {
			return;
		}

		for( let i = 0; i <= SlimeCore.Controls.Gamepad.BUTTON._MAX_INDEX; i++ ) {
			let btn = this._gamepadData.buttons[i];

			if( ( !btn || !btn.pressed ) && this._ignoreUntilPressedAgain[i] ) {
				delete this._ignoreUntilPressedAgain[i];
			}
		}
	}


	/**
	 * Update the gamepad data by quering it first.
	 */
	updateGamepadData() {
		let gp = navigator.getGamepads()[this._gamepadData.index];
		gp && this.setGamepadData( gp );
	}


}


SlimeCore_Controls_Gamepad.BUTTON = {
	_MAX_INDEX: 17,

	// PS4
	PS_X: 0,
	PS_CIRCLE: 1,
	PS_SQUARE: 2,
	PS_TRIANGLE: 3,

	PS_L1: 4,
	PS_L2: 6,
	PS_L3: 10,

	PS_R1: 5,
	PS_R2: 7,
	PS_R3: 11,

	PS_SHARE: 8,
	PS_OPTIONS: 9,
	PS_CONNECT: 16,
	PS_PAD: 17,

	// XBOX
	XBOX_A: 0,
	XBOX_B: 1,
	XBOX_X: 2,
	XBOX_Y: 3,

	XBOX_LEFT_TOP: 4,
	XBOX_LEFT_TRIGGER: 6,
	XBOX_LEFT_STICK: 10,

	XBOX_RIGHT_TOP: 5,
	XBOX_RIGHT_TRIGGER: 7,
	XBOX_RIGHT_STICK: 11,

	XBOX_SELECT: 8,
	XBOX_START: 9,

	// Generic controller
	// @see https://w3c.github.io/gamepad/#remapping
	GEN_RIGHT_BOTTOM: 0,
	GEN_RIGHT_RIGHT: 1,
	GEN_RIGHT_LEFT: 2,
	GEN_RIGHT_TOP: 3,

	GEN_TOP_L1: 4,
	GEN_TOP_L2: 6,

	GEN_TOP_R1: 5,
	GEN_TOP_R2: 7,

	GEN_SELECT: 8,
	GEN_START: 9,

	GEN_LEFT_STICK_PRESS: 10,
	GEN_RIGHT_STICK_PRESS: 11,

	// Overlap
	DPAD_UP: 12,
	DPAD_DOWN: 13,
	DPAD_LEFT: 14,
	DPAD_RIGHT: 15
};

SlimeCore.Controls.Gamepad = SlimeCore_Controls_Gamepad;

}
