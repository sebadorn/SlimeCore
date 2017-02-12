'use strict';


/**
 * Gamepad.
 * @extends {SlimeCore.Controls.Controller}
 * @param   {Gamepad} gp
 */
SlimeCore.Controls.Gamepad = function( gp ) {
	SlimeCore.Controls.Controller.call( this );

	this._gamepadData = gp || null;
	this._ignoreUntilPressedAgain = {};

	if( gp ) {
		this._gamepadData.axes[0] = 0.0;
		this._gamepadData.axes[1] = 0.0;
		this._gamepadData.axes[2] = 0.0;
		this._gamepadData.axes[3] = 0.0;
	}
};


SlimeCore.Controls.Gamepad.BUTTON = {
	// PS4: 18 buttons
	X: 0,
	CIRCLE: 1,
	SQUARE: 2,
	TRIANGLE: 3,

	UP: 12,
	DOWN: 13,
	LEFT: 14,
	RIGHT: 15,

	L1: 4,
	L2: 6,
	L3: 10,

	R1: 5,
	R2: 7,
	R3: 11,

	SHARE: 8,
	OPTIONS: 9,
	CONNECT: 16,
	PAD: 17
};


SlimeCore.Controls.Gamepad.prototype = Object.create(
	SlimeCore.Controls.Controller.prototype
);

SlimeCore.Controls.Gamepad.prototype.constructor = SlimeCore.Controls.Gamepad;


SlimeCore.Utils.extend( SlimeCore.Controls.Gamepad.prototype, {


	/**
	 * Correct possible dead zones of a stick.
	 * (Loose sticks causing minor unwanted shaking.)
	 * @see   http://www.third-helix.com/2013/04/12/doing-thumbstick-dead-zones-right.html
	 * @param {Number} axesIndex Starting index for the two axes. (0: left stick, 2: right stick)
	 */
	_correctStickDeadZone: function( axesIndex ) {
		var dz = SlimeCore.CONFIG['controls.gamepad.deadzone'];

		if( !dz ) {
			return;
		}

		var gp = this._gamepadData;
		var len = Math.sqrt(
			gp.axes[axesIndex] * gp.axes[axesIndex] +
			gp.axes[axesIndex + 1] * gp.axes[axesIndex + 1]
		);

		if( len >= dz ) {
			this._gamepadData.axes[axesIndex] = 0.0;
			this._gamepadData.axes[axesIndex + 1] = 0.0;
		}
		else {
			var f = ( len - dz ) / ( 1 - dz );
			this._gamepadData.axes[axesIndex] = gp.axes[axesIndex] / len * f;
			this._gamepadData.axes[axesIndex + 1] = gp.axes[axesIndex + 1] / len * f;
		}
	},


	/**
	 * Get pressed directions represented by a value [0.0, 1.0].
	 * @override
	 * @return {Object}
	 */
	getDirections: function() {
		var dir = {
			down: Number(this.isPressedDown()),
			left: Number(this.isPressedLeft()),
			right: Number(this.isPressedRight()),
			up: Number(this.isPressedUp()),
			x: 0,
			y: 0
		};

		var stick = this.getStickLeft();

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
	},


	/**
	 * Get the position of the left stick.
	 * @return {Object} Position (x, y).
	 */
	getStickLeft: function() {
		if( !this._gamepadData ) {
			return null;
		}

		return {
			x: this._gamepadData.axes[0],
			y: this._gamepadData.axes[1]
		};
	},


	/**
	 * Get the position of the right stick.
	 * @return {Object} Position (x, y).
	 */
	getStickRight: function() {
		if( !this._gamepadData ) {
			return null;
		}

		return {
			x: this._gamepadData.axes[2],
			y: this._gamepadData.axes[3]
		};
	},


	/**
	 * Check, if the given button index is pressed.
	 * @param  {SlimeCore.Controls.Gamepad.BUTTON} button
	 * @param  {Object}                            flags
	 * @return {Boolean}                                  True if pressed, false otherwise.
	 */
	isPressed: function( button, flags ) {
		var isPressed = (
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
	},


	/**
	 * Check, if the button for moving down is pressed.
	 * @override
	 * @param  {Object}  flags
	 * @return {Boolean}       True if pressed, false otherwise.
	 */
	isPressedDown: function( flags ) {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.DOWN, flags );
	},


	/**
	 * Check, if the button for the given interaction is pressed.
	 * @param  {SlimeCore.Controls.Controller.INTERACT} what
	 * @param  {Object}                                 flags
	 * @return {Boolean}                                      True if pressed, false otherwise.
	 */
	isPressedInteract: function( what, flags ) {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;
		var INTERACT = SlimeCore.Controls.Controller.INTERACT;

		switch( what ) {
			case INTERACT.DIALOG:
				return this.isPressed( BUTTON.SQUARE, flags );

			case INTERACT.SPECIAL:
				return this.isPressed( BUTTON.TRIANGLE, flags );

			case INTERACT.FIGHT:
				return this.isPressed( BUTTON.CIRCLE, flags );

			case INTERACT.SELECT:
				return this.isPressed( BUTTON.X, flags );
		}
	},


	/**
	 * Check, if the button for moving left is pressed.
	 * @override
	 * @return {Boolean} True if pressed, false otherwise.
	 */
	isPressedLeft: function() {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.LEFT].pressed &&
			this._gamepadData.buttons[BUTTON.LEFT].value
		);
	},


	/**
	 * Check, if the button for selecting the next option is pressed.
	 * @override
	 * @param  {Object}  flags
	 * @return {Boolean}       True if pressed, false otherwise.
	 */
	isPressedPrevious: function( flags ) {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.L1, flags );
	},


	/**
	 * Check, if the button for moving right is pressed.
	 * @override
	 * @param  {Object}  flags
	 * @return {Boolean}       True if pressed, false otherwise.
	 */
	isPressedRight: function( flags ) {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.RIGHT, flags );
	},


	/**
	 * Check, if the button for selecting the next option is pressed.
	 * @override
	 * @param  {Object}  flags
	 * @return {Boolean}       True if pressed, false otherwise.
	 */
	isPressedNext: function( flags ) {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return this.isPressed( BUTTON.R1, flags );
	},


	/**
	 * Check, if the button for selecting the option is pressed.
	 * @override
	 * @return {Boolean} True if pressed, false otherwise.
	 */
	isPressedSelect: function() {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.X].pressed &&
			this._gamepadData.buttons[BUTTON.X].value
		);
	},


	/**
	 * Check, if the button for moving up is pressed.
	 * @override
	 * @return {Boolean} True if pressed, false otherwise.
	 */
	isPressedUp: function() {
		var BUTTON = SlimeCore.Controls.Gamepad.BUTTON;

		return (
			this._gamepadData.buttons[BUTTON.UP].pressed &&
			this._gamepadData.buttons[BUTTON.UP].value
		);
	},


	/**
	 * Set the gamepad data.
	 * @param {Gamepad} gp
	 */
	setGamepadData: function( gp ) {
		this.updateButtonIgnoreStates();

		// No state changes, ignore.
		if( this._gamepadData && gp.timestamp == this._gamepadData.timestamp ) {
			return;
		}

		this._gamepadData = gp;
		this._correctStickDeadZone( 0 );
		this._correctStickDeadZone( 2 );
	},


	/**
	 * Reset the button ignore flags where necessary.
	 */
	updateButtonIgnoreStates: function() {
		if( !this._gamepadData ) {
			return;
		}

		for( var key in SlimeCore.Controls.Gamepad.BUTTON ) {
			var index = SlimeCore.Controls.Gamepad.BUTTON[key];
			var isPressed = this._gamepadData.buttons[index].pressed;

			if( !isPressed && this._ignoreUntilPressedAgain[index] ) {
				delete this._ignoreUntilPressedAgain[index];
			}
		}
	},


	/**
	 * Update the gamepad data by quering it first.
	 */
	updateGamepadData: function() {
		var gp = navigator.getGamepads()[this._gamepadData.index];
		gp && this.setGamepadData( gp );
	}


} );
