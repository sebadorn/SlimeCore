'use strict';


/**
 * @namespace SlimeCore.Audio
 */
SlimeCore.Audio = {


	AUDIO_TYPE: {
		BUFFER: 1,
		OSCILLATOR: 2
	},
	SAFETY_MAX_GAIN_VALUE: 2.0,
	WAVEFORM: {
		CUSTOM: 'custom',
		DEFAULT: 'sine',
		SAWTOOTH: 'sawtooth',
		SINE: 'sine',
		SQUARE: 'square',
		TRIANGLE: 'triangle'
	},

	_context: null,
	_groups: {},


	/**
	 * Create a new Audio Group.
	 * @param  {string} name
	 * @return {SlimeCore.Audio.Group}
	 */
	addGroup( name ) {
		if( !this._context ) {
			this.init();
		}

		let group = new SlimeCore.Audio.Group( name, this._context );
		this._groups[name] = group;

		return group;
	},


	/**
	 * Get an Audio Group.
	 * @param  {string} name
	 * @return {?SlimeCore.Audio.Group}
	 */
	getGroup( name ) {
		return this._groups[name] || null;
	},


	/**
	 * Initialize.
	 */
	init() {
		if( this._context ) {
			this._context.close();
		}

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		this._context = new AudioContext();
	},


	/**
	 * Load a local audio file as buffer.
	 * @param {object}   filepath - Filepath.
	 * @param {function} cb       - Callback.
	 */
	loadLocalFile( filepath, cb ) {
		const fs = require( 'fs' );

		if( !this._context ) {
			this.init();
		}

		fs.readFile( filepath, ( err, data ) => {
			if( err ) {
				cb( err, null );
				return;
			}

			let promise = this._context.decodeAudioData( data.buffer );

			promise.catch( ( err ) => {
				cb( err, null );
			} );

			promise.then( ( decodedData ) => {
				cb( null, decodedData );
			} );
		} );
	},


	/**
	 * Removes and disconnects the group, but doesn't destroy it.
	 * @param  {string} name
	 * @return {?SlimeCore.Audio.Group}
	 */
	removeGroup( name ) {
		let group = this._groups[name];
		group.topNode.disconnect( this._context );

		delete this._groups[name];

		return group;
	},


	/**
	 * Resume all suspended audio playback.
	 */
	resume() {
		this._context.resume();
	},


	/**
	 * Get the AudioContext state.
	 * @return {?string} "suspended", "running", or "closed". null if not initialized yet.
	 */
	get state() {
		if( !this._context ) {
			return null;
		}

		return this._context.state;
	},


	/**
	 * Pause all audio playback.
	 */
	suspend() {
		this._context.suspend();
	}


};
