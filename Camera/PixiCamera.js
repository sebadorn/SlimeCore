'use strict';


{

class SlimeCore_PixiCamera extends SlimeCore.Camera {


	/**
	 *
	 * @constructor
	 * @extends {SlimeCore.Camera}
	 * @param   {?object} cfg
	 */
	constructor( cfg ) {
		super( cfg );

		this._applyX = 0;
		this._applyY = 0;

		this._height = 0;
		this._width = 0;

		this._halfHeight = 0;
		this._halfWidth = 0;

		this._stage = null;
	}


	/**
	 * Add a top and bottom border, for example for a cutscene.
	 * @param {object}    args          - Options for the effect.
	 * @param {number}    args.color    - Color of the borders. [0x000000, 0xFFFFFF]
	 * @param {number}    args.duration - How long the borders stay in [ms].
	 *     Does not including slide in/out animation time.
	 * @param {number}    args.height   - Height of each border. [px]
	 * @param {number}    args.slideIn  - How long the slide in animation takes. [ms]
	 * @param {number}    args.slideOut - How long the slide out animation takes. [ms]
	 * @param {?function} cb            - Callback when the effect is done.
	 *     Will not be called if duration is <= 0.
	 */
	addBorders( args, cb ) {
		const Utils = SlimeCore.Utils;

		// Default: Black.
		args.color = Utils.isNumber( args.color ) ? args.color : 0;
		// Default: Stays until removed.
		args.duration = Utils.isNumber( args.duration ) ? args.duration : 0;
		// Default: 100px.
		args.height = Utils.isNumber( args.height ) ? args.height : 100;
		// Default: No animation.
		args.slideIn = Utils.isNumber( args.slideIn ) ? args.slideIn : 0;
		args.slideOut = Utils.isNumber( args.slideOut ) ? args.slideOut : 0;

		// TODO:
	}


	/**
	 * Add a shake effect.
	 * @param {object}   args           - Options for the effect.
	 * @param {number}   args.duration
	 * @param {number}   args.strengthX
	 * @param {number}   args.strengthY
	 * @param {function} cb             - Callback when the effect is done.
	 */
	addEffectShake( args, cb ) {
		const Utils = SlimeCore.Utils;

		// Default: No shake on X axis.
		args.strengthX = Utils.isNumber( args.strengthX ) ? args.strengthX : 0;
		// Default: No shake on Y axis.
		args.strengthY = Utils.isNumber( args.strengthY ) ? args.strengthY : 0;

		// TODO:
	}


	/**
	 * Apply the camera settings on the stage.
	 */
	apply() {
		this._stage.position.set( this._applyX, this._applyY );
	}


	/**
	 * Center the stage on the given PIXI object.
	 * @param {PIXI.DisplayObject} thing
	 * @param {number}            [offsetX = 0]
	 * @param {number}            [offsetY = 0]
	 */
	centerOn( thing, offsetX = 0, offsetY = 0 ) {
		let relX = thing.position.x;
		let relY = thing.position.y;
		let relW = thing.width;
		let relH = thing.height;
		let targetHalfW = relW * 0.5;
		let targetHalfH = relH * 0.5;

		// Limit the view to the given bounds.

		const bounds = this._global.bounds;

		if( typeof bounds.left === 'number' ) {
			if( bounds.left + this._halfWidth > relX + targetHalfW ) {
				relX = bounds.left + this._halfWidth;
				targetHalfW = 0;
			}
		}

		if( typeof bounds.right === 'number' ) {
			if( bounds.right - this._halfWidth < relX + targetHalfW ) {
				relX = bounds.right - this._halfWidth;
				targetHalfW = 0;
			}
		}

		if( typeof bounds.top === 'number' ) {
			if( bounds.top + this._halfHeight > relY + targetHalfH ) {
				relY = bounds.top + this._halfHeight;
				targetHalfH = 0;
			}
		}

		if( typeof bounds.bottom === 'number' ) {
			if( bounds.bottom - this._halfHeight < relY + targetHalfH ) {
				relY = bounds.bottom - this._halfHeight;
				targetHalfH = 0;
			}
		}

		this._applyX = this._halfWidth - targetHalfW - relX;
		this._applyY = this._halfHeight - targetHalfH - relY;

		this._applyX += offsetX + this._global.offsetX;
		this._applyY += offsetY + this._global.offsetY;
	}


	/**
	 * Set the stage to set the position of and apply effects to.
	 * @param {PIXI.DisplayObject} stage
	 * @param {number}             width  - Viewport width.
	 * @param {number}             height - Viewport height.
	 */
	setStage( stage, width, height ) {
		this._stage = stage;

		this._height = height;
		this._width = width;

		this._halfHeight = height * 0.5;
		this._halfWidth = width * 0.5;
	}


	/**
	 * Zoom in on something.
	 * @param {object}    args            - Options for the effect.
	 * @param {number}    args.duration   - Time it takes to zoom in. [ms]
	 * @param {number}    args.factor     - How much to zoom in.
	 * @param {object}    args.position   - Position to zoom in on.
	 * @param {number}    args.position.x - [px]
	 * @param {number}    args.position.y - [px]
	 * @param {?function} cb              - Callback when the effect is done.
	 */
	zoomIn( args, cb ) {
		const Utils = SlimeCore.Utils;

		// Default: No animation.
		args.duration = Utils.isNumber( args.duration ) ? args.duration : 0;
		// Default: No zoom.
		args.factor = Utils.isNumber( args.factor ) ? args.factor : 1;
		// Default: If no position is given, zoom in on the camera position.

		// TODO:
	}


	/**
	 * Zoom out to something.
	 * @param {object}    args            - Options for the effect.
	 * @param {number}    args.duration   - Time it takes to zoom out. [ms]
	 * @param {number}    args.factor     - How much to zoom out.
	 * @param {object}    args.position   - Position to zoom out to.
	 * @param {number}    args.position.x - [px]
	 * @param {number}    args.position.y - [px]
	 * @param {?function} cb              - Callback when the effect is done.
	 */
	zoomOut( args, cb ) {
		const Utils = SlimeCore.Utils;

		// Default: No animation.
		args.duration = Utils.isNumber( args.duration ) ? args.duration : 0;
		// Default: No zoom.
		args.factor = Utils.isNumber( args.factor ) ? args.factor : 1;
		// Default: If no position is given, zoom out to the camera position.

		// TODO:
	}


}


SlimeCore.Camera.PixiCamera = SlimeCore_PixiCamera;

}
