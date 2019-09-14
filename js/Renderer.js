'use strict';


{

/**
 * @alias SlimeCore.Renderer
 */
class SlimeCore_Renderer {


	/**
	 * Get the current background color.
	 * @return {(number|string)}
	 */
	get backgroundColor() {
		throw new Error( '[SlimeCore.Renderer.backgroundColor]' +
			' Getter not implemented by extending class.' );
	}


	/**
	 * Set a background color.
	 * @param  {(number|string)} color - The color to use.
	 * @return {(number|string)} The new background color.
	 */
	set backgroundColor( color ) {
		throw new Error( '[SlimeCore.Renderer.backgroundColor]' +
			' Setter not implemented by extending class.' );
	}


	/**
	 * Get the renderer height.
	 * @return {number}
	 * @throws {Error}
	 */
	get height() {
		throw new Error( '[SlimeCore.Renderer.height]' +
			' Getter not implemented by extending class.' );
	}


	/**
	 * Get the renderer width.
	 * @return {number}
	 * @throws {Error}
	 */
	get width() {
		throw new Error( '[SlimeCore.Renderer.width]' +
			' Getter not implemented by extending class.' );
	}


	/**
	 * Application main loop.
	 * @override
	 * @param  {number} time
	 * @throws {Error}
	 */
	mainLoop( time ) {
		throw new Error( '[SlimeCore.Renderer.mainLoop]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Resize the renderer.
	 * @param  {number} w
	 * @param  {number} h
	 * @throws {Error}
	 */
	resize( w, h ) {
		throw new Error( '[SlimeCore.Renderer.resize]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Start rendering.
	 * @throws {Error}
	 */
	start() {
		throw new Error( '[SlimeCore.Renderer.start]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Stop rendering.
	 * @throw {Error}
	 */
	stop() {
		throw new Error( '[SlimeCore.Renderer.stop]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Main loop update function.
	 * @param {number} deltaTime
	 */
	update( deltaTime ) {
		throw new Error( '[SlimeCore.Renderer.update]' +
			' Update function has to be set by application.' );
	}


}


SlimeCore.Renderer = SlimeCore_Renderer;

}