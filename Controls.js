'use strict';


/**
 * @namespace SlimeCore.Controls
 */
SlimeCore.Controls = {


	_gamepad: {
		0: null,
		1: null,
		2: null,
		3: null
	},
	_keyboard: null,


	mapping: {
		gamepad: {},
		keyboard: {}
	},


	TYPE: {
		GAMEPAD: 1,
		KEYBOARD: 2
	},


	/**
	 * Handle gamepad events.
	 * @private
	 */
	_handleGamepadEvents() {
		// Gamepad connected.
		window.addEventListener( 'gamepadconnected', ( ev ) => {
			SlimeCore.Log.log( '[SlimeCore.Controls._handleGamepadEvents]' +
				` Gamepad ${ev.gamepad.index} connected.` );

			this._gamepad[ev.gamepad.index] = new this.Gamepad( ev.gamepad );
		} );

		// Gamepad disconnected.
		window.addEventListener( 'gamepaddisconnected', ( ev ) => {
			SlimeCore.Log.log( '[SlimeCore.Controls._handleGamepadEvents]' +
				` Gamepad ${ev.gamepad.index} disconnected.` );

			this._gamepad[ev.gamepad.index] = null;
		} );
	},


	/**
	 * Clear the mapping.
	 */
	clearMapping() {
		this.mapping = {
			gamepad: {},
			keyboard: {}
		};
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
	 * @return {object}
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
			this._keyboard = new this.Keyboard();
		}

		return this._keyboard;
	},


	/**
	 * Get the mapping for a key and control type. A
	 * mapping can be a single key/button ID or an array
	 * of those.
	 * @param  {*}      key
	 * @param  {number} controlType
	 * @return {(number|number[]|undefined)}
	 */
	getMapping( key, controlType = null ) {
		const TYPE = SlimeCore.Controls.TYPE;

		if( !controlType ) {
			let control = this.getActiveController();
			controlType = control.type;
		}

		if( controlType === TYPE.GAMEPAD ) {
			return this.mapping.gamepad[key];
		}
		else {
			return this.mapping.keyboard[key];
		}
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
		let gamepads = navigator.getGamepads();

		if( typeof gamepads === 'object' ) {
			for( let index in gamepads ) {
				let gp = gamepads[index];
				this.updateGamepad( gp );
			}
		}
		else if( gamepads instanceof Array ) {
			for( let i = 0; i < gamepads.length; i++ ) {
				let gp = gamepads[i];
				this.updateGamepad( gp );
			}
		}
	}


};
