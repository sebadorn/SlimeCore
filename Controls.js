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
	_handleGamepadEvents() {
		// Gamepad connected.
		window.addEventListener( 'gamepadconnected', ( ev ) => {
			SlimeCore.log.info( '[SlimeCore.Controls._handleGamepadEvents]' +
				` Gamepad ${ev.gamepad.index} connected.` );

			this._gamepad[ev.gamepad.index] = new this.Gamepad( ev.gamepad );
		} );

		// Gamepad disconnected.
		window.addEventListener( 'gamepaddisconnected', ( ev ) => {
			SlimeCore.log.info( '[SlimeCore.Controls._handleGamepadEvents]' +
				` Gamepad ${ev.gamepad.index} disconnected.` );

			this._gamepad[ev.gamepad.index] = null;
		} );
	},


	/**
	 * Get the active controller.
	 * @return {SlimeCore.Controls.Controller} Either a Keyboard or Gamepad.
	 */
	getActiveController() {
		for( let index in this._gamepad ) {
			if( this._gamepad[index] ) {
				return this._gamepad[index];
			}
		}

		return this._keyboard;
	},


	/**
	 * Initialize controls/controllers.
	 */
	init() {
		this.getKeyboard();
		this._handleGamepadEvents();
	},


	/**
	 * Get the connected gamepads.
	 * @return {Object}
	 */
	getGamepads() {
		return this._gamepad;
	},


	/**
	 * Get the keyboard.
	 * @return {SlimeCore.Controls.Keyboard}
	 */
	getKeyboard() {
		if( !this._keyboard ) {
			this._keyboard = new this.Keyboard( 1 );
		}

		return this._keyboard;
	},


	/**
	 * Update a gamepad.
	 * @param {Gamepad} gp Gamepad data.
	 */
	updateGamepad( gp ) {
		if( gp === null || !this._gamepad[gp.index] ) {
			return;
		}

		this._gamepad[gp.index].setGamepadData( gp );
	},


	/**
	 * Update the gamepad states.
	 */
	updateGamepads() {
		var gamepads = navigator.getGamepads();

		if( gamepads instanceof Array ) {
			for( let i = 0; i < gamepads.length; i++ ) {
				let gp = gamepads[i];
				this.updateGamepad( gp );
			}
		}
		else { // instanceof Object
			for( let index in gamepads ) {
				let gp = gamepads[index];
				this.updateGamepad( gp );
			}
		}
	}


};
