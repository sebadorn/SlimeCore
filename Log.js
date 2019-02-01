'use strict';


{

const fs = require( 'fs' );
const path = require( 'path' );


/**
 * @namespace SlimeCore.Log
 */
SlimeCore.Log = {


	INTERVAL_SIZE_CHECK: 30 * 1000, // [ms]
	MAX_FILE_SIZE: 2 * 1024 * 1024, // [Bytes]

	_isStreamReady: true,
	_lastSizeCheck: 0,
	_outPath: null,
	_writeMsgQueue: [],
	_writeStream: null,


	/**
	 * Log a message.
	 * @private
	 * @param {string} level - Log level.
	 * @param {*}      msg   - Message to log.
	 */
	_log( level, msg ) {
		console[level]( msg );
		msg = Date.now() + ' ' + msg + '\n';
		this._logToFile( level, msg );
	},


	/**
	 * Log a message to the log file.
	 * @private
	 * @param {string} level - Log level.
	 * @param {*}      msg   - Message to log.
	 */
	_logToFile( level, msg ) {
		if( !this._outPath ) {
			return;
		}

		if( !this._writeStream ) {
			try {
				this._writeStream = fs.createWriteStream( this._outPath, { flags: 'a' } );
			}
			catch( err ) {
				console.error( err );
				console.error( '[SlimeCore.Log._logToFile] File logging has been stopped.' );

				this._outPath = null;

				return;
			}
		}

		if( !this._isStreamReady ) {
			this._writeMsgQueue.push( { level: level, msg: msg } );
			return;
		}

		if( Date.now() - this._lastSizeCheck >= this.INTERVAL_SIZE_CHECK ) {
			this._lastSizeCheck = Date.now();
			let stat = fs.statSync( this._outPath );

			if( stat.size >= this.MAX_FILE_SIZE ) {
				this._writeMsgQueue.push( { level: level, msg: msg } );
				this._startNewLogFile();

				return;
			}
		}

		this._isStreamReady = this._writeStream.write( msg );

		// Stream still ready for more writing.
		if( this._isStreamReady ) {
			return;
		}

		// Stream cannot keep up. Wait for it to drain,
		// then write the queued log messages.
		this._writeStream.once( 'drain', this._writeQueued.bind( this ) );
	},


	/**
	 * Start a new log file.
	 * @private
	 */
	_startNewLogFile() {
		console.log( '[SlimeCore.Log._startNewLogFile] Starting new log file.' );

		if( this._writeStream ) {
			this._writeStream.end();

			let old = this._outPath + '.old';

			try {
				if( fs.existsSync( old ) ) {
					fs.unlinkSync( old );
				}

				fs.renameSync( this._outPath, old );
			}
			catch( err ) {
				console.error( err );
				console.error( '[SlimeCore.Log._startNewLogFile] File logging has been stopped.' );

				this._outPath = null;

				return;
			}
		}

		this._writeStream = fs.createWriteStream( this._outPath, { flags: 'a' } );
	},


	/**
	 * On "drain": Write as much queued messages as possible.
	 * @private
	 */
	_writeQueued() {
		this._isStreamReady = true;

		// Empty the queue.
		while( this._writeMsgQueue.length > 0 ) {
			let item = this._writeMsgQueue.splice( 0, 1 )[0];
			this._logToFile( item.level, item.msg );

			// Stop, stream cannot keep up.
			if( !this._isStreamReady ) {
				break;
			}
		}
	},


	/**
	 * Prepare for application exit.
	 */
	cleanup() {
		if( this._writeStream ) {
			this._writeStream.end();
			this._writeStream = null;
		}
	},


	/**
	 * Log debug message.
	 * @param {*} msg
	 */
	debug( msg ) {
		this._log( 'debug', msg );
	},


	/**
	 * Log error.
	 * @param {*} msg
	 */
	error( msg ) {
		this._log( 'error', msg );
	},


	/**
	 * Get the log file path.
	 * @return {?string}
	 */
	getLogFilePath() {
		return this._outPath;
	},


	/**
	 * Log info.
	 * @param {*} msg
	 */
	info( msg ) {
		this._log( 'info', msg );
	},


	/**
	 * Log message.
	 * @param {*} msg
	 */
	log( msg ) {
		this._log( 'log', msg );
	},


	/**
	 * Set the path for the log file location.
	 * @param  {string} out
	 * @return {?string} If successful, the path it was set to,
	 *     otherwise null if an error occured.
	 */
	setLogDir( out ) {
		let stats = null;

		this._outPath = null;

		try {
			stats = fs.statSync( out );
		}
		catch( err ) {
			this.error( `[SlimeCore.Log.setFilePath] ${err.message}` );
			this.error( '[SlimeCore.Log.setFilePath] Logging to file will not be possible.' );

			return null;
		}

		if( !stats.isDirectory() ) {
			this.error( `[SlimeCore.Log.setFilePath] Not a directory: ${out}` );

			return null;
		}

		out = path.join( out, nw.App.manifest.name + '.log' );

		if( !fs.existsSync( out ) ) {
			let fd = fs.openSync( out, 'w' );
			fs.closeSync( fd );
		}

		let logStats = null;

		try {
			logStats = fs.statSync( out );

			if( logStats.size >= this.MAX_FILE_SIZE ) {
				this.log( '[SlimeCore.Log.setLogDir] Max file size reached.' );

				let old = out + '.old';

				// Remove previous old log file.
				if( fs.existsSync( old ) ) {
					fs.unlinkSync( old );
				}

				// Rename current log file to old one.
				fs.renameSync( out, old );
			}
		}
		catch( err ) {
			this.error( `[SlimeCore.Log.setFilePath] ${err.message}` );

			return null;
		}

		this._outPath = out;

		return this._outPath;
	},


	/**
	 * Log warning.
	 * @param {*} msg
	 */
	warn( msg ) {
		this._log( 'warn', msg );
	}


};

}
