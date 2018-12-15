'use strict';


{

class SlimeCore_Audio_Group {


	/**
	 * Audio Group.
	 * @constructor
	 * @param {string}                 name
	 * @param {AudioContext}           audioContext
	 * @param {?SlimeCore.Audio.Group} parent
	 */
	constructor( name, audioContext, parent ) {
		this._context = audioContext;

		this._gainNode = this._context.createGain();

		this._pannerNode = this._context.createStereoPanner();
		this._pannerNode.connect( this._gainNode );

		this._audio = {};
		this._groups = {};
		this._paused = {};
		this._playing = {};

		this._gainBeforeMute = 1.0;
		this._name = name;
		this._parent = null;

		if( parent instanceof SlimeCore.Audio.Group ) {
			this._parent = parent;
			this._gainNode.connect( this._parent.bottomNode );
		}
		else {
			this._gainNode.connect( this._context.destination );
		}
	}


	/**
	 * Get a readily prepared oscillator node.
	 * @private
	 * @param  {object} params
	 * @param  {number} params.frequency
	 * @param  {string} params.type
	 * @return {OscillatorNode}
	 */
	_getReadyOscillatorNode( params ) {
		let osc = this._context.createOscillator();
		osc.type = params.type;
		osc.frequency.value = params.frequency;
		osc.connect( this.bottomNode );

		return osc;
	}


	/**
	 * Get a readily prepared audio source node.
	 * @private
	 * @param  {string} name
	 * @return {AudioBufferSourceNode}
	 */
	_getReadySourceNode( name ) {
		let source = this._context.createBufferSource();
		source.buffer = this._audio[name].buffer;
		source.connect( this.bottomNode );

		return source;
	}


	/**
	 * Remove a node when it ended.
	 * @private
	 * @param {string} playID
	 */
	_removeNodeOnEnded( playID ) {
		let node = this._playing[playID];
		node.disconnect( this.bottomNode );

		delete this._playing[playID];
	}


	/**
	 * Load audio data from a file.
	 * @param  {string}    name
	 * @param  {string}    filepath
	 * @param  {?function} cb       - Callback.
	 * @return {boolean} True if the name is still free, false if it is already taken.
	 */
	addAudioFromFile( name, filepath, cb ) {
		if( this.isAudioNameUsed( name ) ) {
			return false;
		}

		SlimeCore.Audio.loadLocalFile( filepath, ( err, audioBuffer ) => {
			if( err ) {
				this._audio[name] = {
					buffer: audioBuffer,
					type: SlimeCore.Audio.AUDIO_TYPE.BUFFER
				};
			}

			cb && cb( err );
		} );

		return true;
	}


	/**
	 * Add the configured nodes necessary to play generated audio.
	 * @param  {string} name
	 * @param  {object} params
	 * @param  {string} params.waveform  - Waveform type.
	 * @param  {number} params.frequency - Hertz.
	 * @return {boolean} True if the name is still free, false if it is already taken.
	 */
	addGeneratedAudio( name, params ) {
		if( this.isAudioNameUsed( name ) ) {
			return false;
		}

		let duration = 0;

		if( SlimeCore.Utils.isNumber( params.duration ) ) {
			duration = params.duration;
		}

		this._audio[name] = {
			params: {
				duration: duration,
				frequency: params.frequency,
				type: params.type || SlimeCore.Audio.WAVEFORM.DEFAULT
			},
			type: SlimeCore.Audio.AUDIO_TYPE.OSCILLATOR
		};

		return true;
	}


	/**
	 * Check if the given name for playable audio is already taken.
	 * @param  {string}  name
	 * @return {boolean}
	 */
	isAudioNameUsed( name ) {
		return !!this._audio[name];
	}


	/**
	 * Create a new Audio Group.
	 * @param  {string} name
	 * @return {SlimeCore.Audio.Group}
	 * @throws {Error} If name is invalid or already taken.
	 */
	addGroup( name ) {
		if( typeof name === 'string' && name.length > 0 ) {
			throw new Error( 'Group name has to be a non-empty string.' );
		}

		if( this._groups[name] ) {
			throw new Error( 'Group name is already taken.' );
		}

		let group = new SlimeCore.Audio.Group( name, this._context, this );

		this._groups[name] = group;

		return group;
	}


	/**
	 * Get the group's node at the bottom, which other
	 * groups and audio nodes for playback connect to.
	 * @return {AudioNode}
	 */
	get bottomNode() {
		return this._pannerNode;
	}


	/**
	 * Remove all audio, all audio from sub groups,
	 * and the sub groups. Will then disconnect the AudioNode
	 * from the parent AudioNode or AudioContext.
	 */
	destroy() {
		this.removeAllAudio();

		for( let name in this._groups ) {
			this._groups[name].destroy();
		}

		if( this._parent ) {
			this._parent.removeGroup( this.name );
		}
		else {
			SlimeCore.Audio.removeGroup( this.name );
		}
	}


	/**
	 * Get a group by name.
	 * @param  {string} name - Name of the group.
	 * @return {?SlimeCore.Audio.Group}
	 */
	getGroup( name ) {
		return this._groups[name] || null;
	}


	/**
	 * Get the group's name.
	 * @return {string}
	 */
	get name() {
		return this._name;
	}


	/**
	 * Mute or unmute an audio file.
	 * @param  {boolean} value
	 * @return {number}
	 */
	mute( value ) {
		if( value ) {
			this._gainBeforeMute = this._gainNode.gain.value;
			this._gainNode.gain.value = 0.0;
		}
		else {
			this._gainNode.gain.value = this._gainBeforeMute;
		}

		return this._gainNode.gain.value;
	}


	/**
	 * Get the pan value.
	 * @return {number} [-1, 1]
	 */
	get pan() {
		return this._pannerNode.pan.value;
	}


	/**
	 * Set the pan value.
	 * @param  {number} value - [-1, 1]
	 * @return {number}
	 */
	set pan( value ) {
		this._pannerNode.pan.value = value;

		return this._pannerNode.pan.value;
	}


	/**
	 * Pause the audio playback of a specific
	 * audio or all including sub-groups.
	 * @param  {(string|undefined)} playID
	 * @return {?string}
	 */
	pause( playID ) {
		if( typeof playID === 'undefined' ) {
			for( let id in this._playing ) {
				this.pause( id );
			}

			for( let name in this._groups ) {
				this._groups[name].pause();
			}

			return null;
		}

		let source = this._playing[playID];
		let parts = playID.split( '_' );

		this._paused[playID] = {
			name: parts[0],
			offset: ( Date.now() - parseInt( parts[1], 10 ) ) / 1000
		};

		source.stop();

		return playID;
	}


	/**
	 * Play an audio file.
	 * @param  {string}   name
	 * @param  {?number} [offset = 0]
	 * @return {?string} Generated ID for the playing source node.
	 */
	play( name, offset = 0 ) {
		let audio = this._audio[name];

		if( !audio ) {
			return null;
		}

		const SCAudio = SlimeCore.Audio;
		const playID = name + '_' + Date.now();

		let node = null;

		// Play an audio buffer.
		if( audio.type === SCAudio.AUDIO_TYPE.BUFFER ) {
			node = this._getReadySourceNode( audio.buffer );
			node.start( 0, offset );
		}
		// Start an oscillator.
		else if( audio.type === SCAudio.AUDIO_TYPE.OSCILLATOR ) {
			node = this._getReadyOscillatorNode( audio.params );
			node.start();

			if( audio.params.duration > 0 ) {
				node.stop( audio.params.duration );
			}
		}
		else {
			return null;
		}

		if( node ) {
			this._playing[playID] = node;

			node.addEventListener( 'ended', () => {
				this._removeNodeOnEnded( playID );
			} );
		}

		return playID;
	}


	/**
	 * Remove all audio of the group.
	 * Does not affect sub-groups.
	 */
	removeAllAudio() {
		for( let playID in this._playing ) {
			this._playing[playID].stop();
		}

		this._audio = {};
		this._paused = {};
	}


	/**
	 * Remove a loaded audio file. If it is currently
	 * playing, the playback will not be stopped.
	 * But paused playback will be stopped and removed.
	 * @param {string} name
	 */
	removeAudio( name ) {
		let audio = this._audio[name];

		for( let playID in this._paused ) {
			let pause = this._paused[playID];

			if( pause.name === name ) {
				delete this._paused[playID];
			}
		}

		delete this._audio[name];
	}


	/**
	 * Removes and disconnects the group, but doesn't destroy it.
	 * @param  {string} name
	 * @return {?SlimeCore.Audio.Group}
	 */
	removeGroup( name ) {
		let group = this._groups[name];
		group.topNode.disconnect( this.bottomNode );

		delete this._groups[name];

		return group;
	}


	/**
	 * Resume playback of an audio file where it was paused.
	 * @param  {(string|undefined)} playID
	 * @return {?string} The new playID.
	 * @throws {Error} If no paused audio for the playID can be found.
	 */
	resume( playID ) {
		if( typeof playID === 'undefined' ) {
			for( let id in this._paused ) {
				this.resume( id );
			}

			for( let name in this._groups ) {
				this._groups[name].resume();
			}

			return null;
		}

		let info = this._paused[playID];
		delete this._paused[playID];

		if( !info ) {
			throw new Error( 'Pause information not available for ID: ' + playID );
		}

		return this.play( info.name, info.offset );
	}


	/**
	 * Stop a specific audio file or all of them
	 * in the group including sub-groups.
	 * @param {(string|undefined)} playID - An ID generated by play().
	 */
	stop( playID ) {
		if( typeof playID === 'undefined' ) {
			for( let id in this._playing ) {
				this._playing[id].stop();
			}

			for( let name in this._groups ) {
				this._groups[name].stop();
			}
		}
		else {
			let audio = this._playing[playID];
			audio && audio.stop();

			delete this._paused[playID];
		}
	}


	/**
	 * Get the group's node at the top, which is connected
	 * to either another group or the context.
	 * @return {AudioNode}
	 */
	get topNode() {
		return this._gainNode;
	}


	/**
	 * Get the relative volume.
	 * @return {number}
	 */
	get volume() {
		return this._gainNode.gain.value;
	}


	/**
	 * Set the relative volume. While not changing
	 * the volume setting of the sub groups, the gain
	 * value of this group will also affect them.
	 * @param  {number} value
	 * @return {number}
	 */
	set volume( value ) {
		const typeOfValue = ( typeof value );

		if( typeOfValue !== 'number' ) {
			throw new Error( 'Expected a number, got: ' + typeOfValue );
		}
		else if( isNaN( value ) ) {
			throw new Error( 'Expected a number, but got NaN.' );
		}

		value = Math.min( value, SlimeCore.Audio.SAFETY_MAX_GAIN_VALUE );
		this._gainNode.gain.value = value;

		return this._gainNode.gain.value;
	}


}


SlimeCore.Audio.Group = SlimeCore_Audio_Group;

}
