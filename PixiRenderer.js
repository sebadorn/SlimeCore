'use strict';


SlimeCore.PixiRenderer = {


	renderer: null,
	ticker: null,

	_frameRequest: null,
	_isRunning: false,


	/**
	 * Initialize rendering.
	 * @param  {String}      viewID  Canvas ID.
	 * @param  {Number}      w       Renderer width.
	 * @param  {Number}      h       Renderer height.
	 * @param  {Object}      options Options.
	 * @return {HTMLElement}         Renderer view.
	 */
	init: function( viewID, w, h, options ) {
		if( !SlimeCore.Utils.isObject( options ) ) {
			options = {};
		}

		if( viewID ) {
			options.view = document.getElementById( viewID );
		}

		if( typeof options.resolution !== 'number' ) {
			options.resolution = window.devicePixelRatio;
		}

		if( typeof w !== 'number' ) {
			w = window.innerWidth;
		}

		if( typeof h !== 'number' ) {
			h = window.innerHeight;
		}

		this.renderer = PIXI.autoDetectRenderer( w, h, options );
		this.renderer.backgroundColor = 0x303030;
		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';

		this.ticker = PIXI.ticker.shared;
		this.ticker.autoStart = false;
		this.ticker.stop();

		return this.renderer.view;
	},


	/**
	 * Application main loop.
	 * @param {Number} time
	 */
	mainLoop: function( time ) {
		var self = SlimeCore.PixiRenderer;

		if( !self._isRunning ) {
			return;
		}

		self.ticker.update( time );

		var displayObject = self.update( self.ticker.deltaTime );
		self.renderer.render( displayObject );

		self._frameRequest = requestAnimationFrame( self.mainLoop );
	},


	/**
	 * Resize the renderer.
	 * @param {Number} w
	 * @param {Number} h
	 */
	resize: function( w, h ) {
		this.renderer.resize( w, h );

		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';
	},


	/**
	 * Start rendering.
	 */
	start: function() {
		if( this._isRunning === false ) {
			this._isRunning = true;
			this._frameRequest = requestAnimationFrame( this.mainLoop );
		}
	},


	/**
	 * Stop rendering.
	 */
	stop: function() {
		this._isRunning = false;
		cancelAnimationFrame( this._frameRequest );
	},


	/**
	 * Main loop update function.
	 * @param {Number} deltaTime
	 */
	update: function( deltaTime ) {
		throw new Error( '[SlimeCore.PixiRenderer.update]' +
			' Update function has to be set by application.' );
	}


};
