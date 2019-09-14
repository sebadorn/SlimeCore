'use strict';


{

/**
 * Renderer for use with PixiJS v5.
 * @alias SlimeCore.PixiRendererV5
 */
class SlimeCore_PixiRendererV5 extends SlimeCore.Renderer {


	/**
	 * Initialize rendering.
	 * @alias SlimeCore.PixiRendererV5
	 * @class
	 * @extends {SlimeCore.Renderer}
	 * @param  {number} w       - Renderer width.
	 * @param  {number} h       - Renderer height.
	 * @param  {object} options - Options.
	 * @return {HTMLElement} Renderer view.
	 */
	constructor( w, h, options ) {
		super();

		const Utils = SlimeCore.Utils;

		if( !Utils.isObject( options ) ) {
			options = {};
		}

		if( !Utils.isNumber( options.resolution ) ) {
			options.resolution = window.devicePixelRatio;
		}

		if( !Utils.isNumber( w ) ) {
			w = window.innerWidth;
		}

		if( !Utils.isNumber( h ) ) {
			h = window.innerHeight;
		}

		this._frameRequest = null;
		this._isRunning = false;

		options.width = w;
		options.height = h;

		if( typeof options.roundPixels !== 'undefined' ) {
			PIXI.settings.ROUND_PIXELS = !!options.roundPixels;
			delete options.roundPixels;
		}

		this.renderer = new PIXI.Application( options );
		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';

		this.ticker = this.renderer.ticker;
		this.ticker.autoStart = false;
		this.ticker.stop();

		// Set a variable to the mainLoop() function with
		// the context set to this class. Otherwise
		// with "mainLoop.bind( this )" used in the main
		// loop itself, a new function would have been
		// created for each frame.
		this._fnMainLoopContextThis = this.mainLoop.bind( this );
	}


	/**
	 * Get the current background color.
	 * @return {number}
	 */
	get backgroundColor() {
		return this.renderer.backgroundColor;
	}


	/**
	 * Set a background color.
	 * @param  {number} color - The color to use.
	 * @return {number} The new background color.
	 */
	set backgroundColor( color ) {
		// Only actually does something if the PIXI.SystemRenderer
		// is not in transparent mode. Otherwise
		// this only a way to remember the current color.
		this.renderer.backgroundColor = color;

		if( this.renderer.transparent ) {
			this.renderer.view.style.backgroundColor = '#' + color.toString( 16 );
		}

		return this.backgroundColor;
	}


	/**
	 * Get the renderer height.
	 * @return {number}
	 */
	get height() {
		return this.renderer.renderer.height;
	}


	/**
	 * Get the renderer width.
	 * @return {number}
	 */
	get width() {
		return this.renderer.renderer.width;
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

		this._frameRequest = requestAnimationFrame( this._fnMainLoopContextThis );
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
			this._frameRequest = requestAnimationFrame( this._fnMainLoopContextThis );
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


SlimeCore.Renderer.PixiRendererV5 = SlimeCore_PixiRendererV5;

}
