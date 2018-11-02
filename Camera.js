'use strict';


{

class SlimeCore_Camera {


	/**
	 * Add a top and bottom border, for example for a cutscene.
	 * @param {object} args           - Options for the effect.
	 * @param {number} args.color     - Color of the borders. [0x000000, 0xFFFFFF]
	 * @param {number} args.duration  - How long the borders stay in [ms].
	 *     Does not including slide in/out animation time.
	 * @param {number} args.height    - Height of each border. [px]
	 * @param {number} args.slideIn   - How long the slide in animation takes. [ms]
	 * @param {number} args.slideOut  - How long the slide out animation takes. [ms]
	 * @param {function} cb - Callback when the effect is done.
	 *     Will not be called if duration is <= 0.
	 */
	addBorders( args, cb ) {
		throw new Error( '[SlimeCore.Camera.addBorders]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Add the shake effect.
	 * @param  {object} args           - Options for the effect.
	 * @param  {number} args.duration
	 * @param  {number} args.strengthX
	 * @param  {number} args.strengthY
	 * @param  {function} cb - Callback when effect is over.
	 * @throws {Error} If not implemented.
	 */
	addEffectShake( args, cb ) {
		throw new Error( '[SlimeCore.Camera.addEffectShake]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Apply the camera settings on the stage.
	 * @throws {Error} If not implemented.
	 */
	apply() {
		throw new Error( '[SlimeCore.Camera.apply]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Center on the thing.
	 * @param  {SlimeCore.Thing} thing - Thing to center the camera on.
	 * @param  {number} offsetX - Offset on X axis to apply after centering.
	 * @param  {number} offsetY - Offset on Y axis to apply after centering.
	 * @throws {Error} If not implemented.
	 */
	centerOn( thing, offsetX = 0, offsetY = 0 ) {
		throw new Error( '[SlimeCore.Camera.centerOn]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Set the stage to set the position of and apply effects to.
	 * @param  {*} stage
	 * @throws {Error} If not implemented.
	 */
	setStage( stage ) {
		throw new Error( '[SlimeCore.Camera.setStage]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Zoom in on something.
	 * @param {object} args            - Options for the effect.
	 * @param {number} args.duration   - Time it takes to zoom in. [ms]
	 * @param {number} args.factor     - How much to zoom in.
	 * @param {object} args.position   - Position to zoom in on.
	 * @param {number} args.position.x - [px]
	 * @param {number} args.position.y - [px]
	 * @param {function} cb - Callback when the effect is done.
	 */
	zoomIn( args, cb ) {
		throw new Error( '[SlimeCore.Camera.zoomIn]' +
			' Not implemented by extending class.' );
	}


	/**
	 * Zoom out to something.
	 * @param {object} args            - Options for the effect.
	 * @param {number} args.duration   - Time it takes to zoom out. [ms]
	 * @param {number} args.factor     - How much to zoom out.
	 * @param {object} args.position   - Position to zoom out to.
	 * @param {number} args.position.x - [px]
	 * @param {number} args.position.y - [px]
	 * @param {function} cb - Callback when the effect is done.
	 */
	zoomOut( args, cb ) {
		throw new Error( '[SlimeCore.Camera.zoomOut]' +
			' Not implemented by extending class.' );
	}


}


SlimeCore.Camera = SlimeCore_Camera;

}
