'use strict';


{

class SlimeCore_PixiRenderer extends SlimeCore.Renderer {


	/**
	 * Initialize rendering.
	 * @constructor
	 * @extends {SlimeCore.Renderer}
	 * @param  {number} w       - Renderer width.
	 * @param  {number} h       - Renderer height.
	 * @param  {object} options - Options.
	 * @return {HTMLElement} Renderer view.
	 */
	constructor( w, h, options ) {
		super();

		if( !SlimeCore.Utils.isObject( options ) ) {
			options = {};
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

		this._frameRequest = null;
		this._isRunning = false;

		this.renderer = PIXI.autoDetectRenderer( w, h, options );
		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';

		this.ticker = PIXI.ticker.shared;
		this.ticker.autoStart = false;
		this.ticker.stop();
	}


	/**
	 * Get the renderer height.
	 * @return {number}
	 */
	get height() {
		return this.renderer.height;
	}


	/**
	 * Get the renderer width.
	 * @return {number}
	 */
	get width() {
		return this.renderer.width;
	}


	/**
	 * Application main loop.
	 * @param {number} time
	 */
	mainLoop( time ) {
		if( !this._isRunning ) {
			return;
		}

		this.ticker.update( time );

		let displayObject = this.update( this.ticker.deltaTime );
		this.renderer.render( displayObject );

		this._frameRequest = requestAnimationFrame( this.mainLoop.bind( this ) );
	}


	/**
	 * Resize the renderer.
	 * @param {number} w
	 * @param {number} h
	 */
	resize( w, h ) {
		this.renderer.resize( w, h );

		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';
	}


	/**
	 * Start rendering.
	 */
	start() {
		if( this._isRunning === false ) {
			this._isRunning = true;
			this._frameRequest = requestAnimationFrame( this.mainLoop.bind( this ) );
		}
	}


	/**
	 * Stop rendering.
	 */
	stop() {
		this._isRunning = false;
		cancelAnimationFrame( this._frameRequest );
	}


}


SlimeCore.Renderer.PixiRenderer = SlimeCore_PixiRenderer;

}
