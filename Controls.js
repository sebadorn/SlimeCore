'use strict';


SlimeCore.Controls = {


	_gamepad: {
		0: null,
		1: null,
		2: null,
		3: null
	},
	_keyboard: null,


	/**
	 * Handle gamepad events.
	 */
	_handleGamepadEvents: function() {
		// Gamepad connected.
		window.addEventListener( 'gamepadconnected', function( ev ) {
			SlimeCore.log.info( '[SlimeCore.Controls._handleGamepadEvents]' +
				' Gamepad ' + ev.gamepad.index + ' connected.' );

			this._gamepad[ev.gamepad.index] = new this.Gamepad( ev.gamepad );
		}.bind( this ) );

		// Gamepad disconnected.
		window.addEventListener( 'gamepaddisconnected', function( ev ) {
			SlimeCore.log.info( '[SlimeCore.Controls._handleGamepadEvents]' +
				' Gamepad ' + ev.gamepad.index + ' disconnected.' );

			this._gamepad[ev.gamepad.index] = null;
		}.bind( this ) );
	},


	/**
	 * Get the active controller.
	 * @return {SlimeCore.Controls.Controller} Either a Keyboard or Gamepad.
	 */
	getActiveController: function() {
		for( var index in this._gamepad ) {
			if( this._gamepad[index] ) {
				return this._gamepad[index];
			}
		}

		return this._keyboard;
	},


	/**
	 * Initialize controls/controllers.
	 */
	init: function() {
		this.getKeyboard();
		this._handleGamepadEvents();
	},


	/**
	 * Get the connected gamepads.
	 * @return {Object}
	 */
	getGamepads: function() {
		return this._gamepad;
	},


	/**
	 * Get the keyboard.
	 * @return {SlimeCore.Controls.Keyboard}
	 */
	getKeyboard: function() {
		if( !this._keyboard ) {
			this._keyboard = new this.Keyboard( 1 );
		}

		return this._keyboard;
	},


	/**
	 * Update a gamepad.
	 * @param {Gamepad} gp Gamepad data.
	 */
	updateGamepad: function( gp ) {
		if( gp === null || !this._gamepad[gp.index] ) {
			return;
		}

		this._gamepad[gp.index].setGamepadData( gp );
	},


	/**
	 * Update the gamepad states.
	 */
	updateGamepads: function() {
		var gamepads = navigator.getGamepads();

		if( gamepads instanceof Array ) {
			for( var i = 0; i < gamepads.length; i++ ) {
				var gp = gamepads[i];
				this.updateGamepad( gp );
			}
		}
		else { // instanceof Object
			for( var index in gamepads ) {
				var gp = gamepads[index];
				this.updateGamepad( gp );
			}
		}
	}


};
