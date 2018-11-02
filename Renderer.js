'use strict';


{

class SlimeCore_Renderer {


	/**
	 * Get the renderer height.
	 * @return {number}
	 * @throws {Error}
	 */
	get height() {
		throw new Error( '[SlimeCore.Renderer.height]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Get the renderer width.
	 * @return {number}
	 * @throws {Error}
	 */
	get width() {
		throw new Error( '[SlimeCore.Renderer.width]' +
			' Not implemented by extending class.' );
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