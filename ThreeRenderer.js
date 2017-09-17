'use strict';


SlimeCore.ThreeRenderer = {


	camera: null,
	renderer: null,
	scene: null,

	_fpsTargetMs: 16.66666666666666,
	_frameRequest: null,
	_isRunning: false,
	_lastFrame: 0,


	/**
	 * Initialize rendering.
	 * @param {Object} options Options:
	 *                         - width Width of the renderer.
	 *                                 Defaults to window.innerWidth.
	 *                         - height Height of the renderer.
	 *                                  Defaults to window.innerHeight.
	 *                         - container Parent container to append the canvas to.
	 *                                     Defaults to document.body.
	 */
	init( options ) {
		if( typeof options !== 'object' || options === null ) {
			options = {};
		}

		if( typeof options.width !== 'number' ) {
			options.width = window.innerWidth;
		}

		if( typeof options.height !== 'number' ) {
			options.height = window.innerHeight;
		}

		if( !options.container ) {
			options.container = document.body;
		}

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer();
		this.resize( options.width, options.height );

		options.container.appendChild( this.renderer.domElement );
	},


	/**
	 * Application main loop.
	 * @param {Number} time
	 */
	mainLoop( time ) {
		var self = SlimeCore.ThreeRenderer;

		if( !self._isRunning ) {
			return;
		}

		var dt = 1.0;

		if( self._lastFrame > 0 ) {
			dt = ( time - self._lastFrame ) / self._fpsTargetMs;
		}

		self.update( dt );
		self.renderer.render( self.scene, self.camera );

		self._lastFrame = time;
		self._frameRequest = requestAnimationFrame( self.mainLoop );
	},


	/**
	 * Resize the renderer.
	 * @param {Number} w
	 * @param {Number} h
	 */
	resize( w, h ) {
		this.renderer.setSize( w, h );

		this.renderer.domElement.style.width = w + 'px';
		this.renderer.domElement.style.height = h + 'px';
	},


	/**
	 * Start rendering.
	 */
	start() {
		if( this._isRunning === false ) {
			this._isRunning = true;
			this._lastFrame = 0;
			this._frameRequest = requestAnimationFrame( this.mainLoop );
		}
	},


	/**
	 * Stop rendering.
	 */
	stop() {
		this._isRunning = false;
		this._lastFrame = 0;
		cancelAnimationFrame( this._frameRequest );
	},


	/**
	 * Main loop update function.
	 * @param {Number} deltaTime
	 */
	update( deltaTime ) {
		throw new Error( '[SlimeCore.ThreeRenderer.update]' +
			' Update function has to be set by application.' );
	}


};
