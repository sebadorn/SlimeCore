'use strict';


{

class SlimeCore_PixiCamera extends SlimeCore.Camera {


	/**
	 *
	 * @constructor
	 * @extends {SlimeCore.Camera}
	 */
	constructor() {
		super();

		this._applyX = 0;
		this._applyY = 0;

		this._height = 0;
		this._width = 0;

		this._stage = null;
	}


	/**
	 * Add a top and bottom border, for example for a cutscene.
	 * @param {object} args          - Options for the effect.
	 * @param {number} args.color    - Color of the borders. [0x000000, 0xFFFFFF]
	 * @param {number} args.duration - How long the borders stay in [ms].
	 *     Does not including slide in/out animation time.
	 * @param {number} args.height   - Height of each border. [px]
	 * @param {number} args.slideIn  - How long the slide in animation takes. [ms]
	 * @param {number} args.slideOut - How long the slide out animation takes. [ms]
	 * @param {?function} cb - Callback when the effect is done.
	 *     Will not be called if duration is <= 0.
	 */
	addBorders( args, cb ) {
		// Default: Black.
		args.color = ( typeof args.color === 'number' ) ? args.color : 0;
		// Default: Stays until removed.
		args.duration = ( typeof args.duration === 'number' ) ? args.duration : 0;
		// Default: 100px.
		args.height = ( typeof args.height === 'number' ) ? args.height : 100;
		// Default: No animation.
		args.slideIn = ( typeof args.slideIn === 'number' ) ? args.slideIn : 0;
		args.slideOut = ( typeof args.slideOut === 'number' ) ? args.slideOut : 0;

		// TODO:
	}


	/**
	 * Add a shake effect.
	 * @param {object} args           - Options for the effect.
	 * @param {number} args.duration
	 * @param {number} args.strengthX
	 * @param {number} args.strengthY
	 * @param {function} cb - Callback when the effect is done.
	 */
	addEffectShake( args, cb ) {
		// Default: No shake on X axis.
		args.strengthX = ( typeof args.strengthX === 'number' ) ? args.strengthX : 0;
		// Default: No shake on Y axis.
		args.strengthY = ( typeof args.strengthY === 'number' ) ? args.strengthY : 0;

		// TODO:
	}


	/**
	 * Apply the camera settings on the stage.
	 */
	apply() {
		let x = this._applyX;
		let y = this._applyY;

		this._stage.position.set( x, y );
	}


	/**
	 * Center the stage on the given PIXI object.
	 * @param {PIXI.DisplayObject} thing
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	centerOn( thing, offsetX = 0, offsetY = 0 ) {
		this._applyX = ( this._width - thing.width ) * 0.5 - thing.position.x + offsetX;
		this._applyY = ( this._height - thing.height ) * 0.5 - thing.position.y + offsetY;
	}


	/**
	 * Set the stage to set the position of and apply effects to.
	 * @param {PIXI.DisplayObject} stage
	 * @param {number} width  - Viewport width.
	 * @param {number} height - Viewport height.
	 */
	setStage( stage, width, height ) {
		this._height = height;
		this._stage = stage;
		this._width = width;
	}


	/**
	 * Zoom in on something.
	 * @param {object} args            - Options for the effect.
	 * @param {number} args.duration   - Time it takes to zoom in. [ms]
	 * @param {number} args.factor     - How much to zoom in.
	 * @param {object} args.position   - Position to zoom in on.
	 * @param {number} args.position.x - [px]
	 * @param {number} args.position.y - [px]
	 * @param {?function} cb - Callback when the effect is done.
	 */
	zoomIn( args, cb ) {
		// Default: No animation.
		args.duration = ( typeof args.duration === 'number' ) ? args.duration : 0;
		// Default: No zoom.
		args.factor = ( typeof args.factor === 'number' ) ? args.factor : 1;
		// Default: If no position is given, zoom in on the camera position.

		// TODO:
	}


	/**
	 * Zoom out to something.
	 * @param {object} args            - Options for the effect.
	 * @param {number} args.duration   - Time it takes to zoom out. [ms]
	 * @param {number} args.factor     - How much to zoom out.
	 * @param {object} args.position   - Position to zoom out to.
	 * @param {number} args.position.x - [px]
	 * @param {number} args.position.y - [px]
	 * @param {?function} cb - Callback when the effect is done.
	 */
	zoomOut( args, cb ) {
		// Default: No animation.
		args.duration = ( typeof args.duration === 'number' ) ? args.duration : 0;
		// Default: No zoom.
		args.factor = ( typeof args.factor === 'number' ) ? args.factor : 1;
		// Default: If no position is given, zoom out to the camera position.

		// TODO:
	}


}


SlimeCore.Camera.PixiCamera = SlimeCore_PixiCamera;

}
