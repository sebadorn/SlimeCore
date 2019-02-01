'use strict';


{

class SlimeCore_Event_Trigger {


	/**
	 *
	 * @constructor
	 * @param {number} type              - A value from SlimeCore.Event.Trigger.TYPE.
	 * @param {object} params
	 * @param {number} params.cooldown
	 * @param {object} params.typeParams
	 */
	constructor( type, params ) {
		this._type = type;
		this._typeParams = {};

		this._insideRefs = [];
		this._handlersOn = {};
		this._handlersOnce = {};

		this.cooldown = 0;
		this.isEnabled = true;

		this._setParams( params );

		this.aabb = {
			x: -Infinity,
			y: -Infinity,
			w: 0,
			h: 0
		};

		this.calculateBoundingBox();
	}


	/**
	 * Set the params depending on type.
	 * @private
	 * @param {object}  params
	 * @param {?number} params.cooldown
	 * @param {object}  params.typeParams
	 */
	_setParams( params ) {
		const Utils = SlimeCore.Utils;

		if( !Utils.isObject( params ) ) {
			params = {};
		}

		if( !Utils.isObject( params.typeParams ) ) {
			params.typeParams = {};
		}

		if( Utils.isNumber( params.cooldown ) && params.cooldown > 0 ) {
			this.cooldown = params.cooldown;
		}

		const TYPE = SlimeCore_Event_Trigger.TYPE;
		const tp = params.typeParams;

		if( this._type === TYPE.AREA ) {
			const SHAPE = SlimeCore_Event_Trigger.SHAPE;

			this._typeParams = {
				// [px] - left of rectangle/center of circle
				x: 0,
				// [px] - top of rectangle/center of circle
				y: 0,
				// [px] - rectangle
				w: 0,
				// [px] - rectangle
				h: 0,
				// [px] - circle
				r: 0,
				// "rectangle" or "circle"
				shape: SHAPE.RECTANGLE
			};

			if( Utils.isNumber( tp.w ) ) {
				this._typeParams.w = tp.w;
			}

			if( Utils.isNumber( tp.h ) ) {
				this._typeParams.h = tp.h;
			}

			if( Utils.isNumber( tp.r ) ) {
				this._typeParams.r = tp.r;
			}

			if( tp.shape === SHAPE.CIRCLE || tp.shape === SHAPE.RECTANGLE ) {
				this._typeParams.shape = tp.shape;
			}
		}
		else if( this._type === TYPE.DISTANCE ) {
			this._typeParams = {
				// [px]
				x: 0,
				// [px]
				y: 0,
				// [px] - euclidean distance
				distance: 0
			};

			if( Utils.isNumber( tp.distance ) ) {
				this._typeParams.distance = tp.distance;
			}
		}


		// The same for all types.

		if( Utils.isNumber( tp.x ) ) {
			this._typeParams.x = tp.x;
		}

		if( Utils.isNumber( tp.y ) ) {
			this._typeParams.y = tp.y;
		}
	}


	/**
	 * Calculate the axis-align bounding box.
	 * @return {object} The axis-aligned bounding box of the trigger.
	 */
	calculateBoundingBox() {
		const SHAPE = SlimeCore_Event_Trigger.SHAPE;
		const TYPE = SlimeCore_Event_Trigger.TYPE;
		const tp = this._typeParams;

		this.aabb.x = tp.x;
		this.aabb.y = tp.y;

		// Type: Area.
		if( this._type === TYPE.AREA ) {
			// Shape: Rectangle.
			if( tp.shape === SHAPE.RECTANGLE ) {
				this.aabb.w = tp.w;
				this.aabb.h = tp.h;
			}
			// Shape: Circle.
			else if( tp.shape === SHAPE.CIRCLE ) {
				this.aabb.w = tp.r * 2;
				this.aabb.h = this.aabb.w;

				this.aabb.x -= this.aabb.w * 0.5;
				this.aabb.y -= this.aabb.h * 0.5;
			}
		}

		return this.aabb;
	}


	/**
	 * Check the trigger against an object and
	 * fire all applicable events.
	 * @param  {object}  aabb   - Axis-aligned bounding box.
	 * @param  {number}  aabb.x - X coordinate.
	 * @param  {number}  aabb.y - Y coordinate.
	 * @param  {number}  aabb.w - Width.
	 * @param  {number}  aabb.h - Height.
	 * @param  {?object} ref    - Object reference of the thing being checked.
	 *     Used for comparisons to determine which events to fire.
	 * @return {boolean} True if the AABB is inside the trigger, false otherwise.
	 */
	check( aabb, ref ) {
		const TYPE = SlimeCore_Event_Trigger.TYPE;
		let isInside = false;
		let refIndex = this._insideRefs.indexOf( ref );

		if( this._type === TYPE.AREA ) {
			const SHAPE = SlimeCore_Event_Trigger.SHAPE;

			if( this._typeParams.shape === SHAPE.RECTANGLE ) {
				isInside = SlimeCore.Math.overlapAABBWithAABB( this.aabb, aabb );
			}
			else if( this._typeParams.shape === SHAPE.CIRCLE ) {
				isInside = SlimeCore.Math.overlapAABBWithCircle( aabb, this._typeParams );
			}
		}
		else if( this._type === TYPE.DISTANCE ) {
			let x = this._typeParams.x;
			let y = this._typeParams.y;
			let distX = Math.min( x - aabb.x - aabb.w, aabb.x - x );
			let distY = Math.min( y - aabb.y - aabb.h, aabb.y - y );
			let euclidean = Math.sqrt( distX * distX + distY * distY );

			isInside = ( euclidean <= this._typeParams.distance );
		}

		// Object is inside trigger area.
		if( isInside ) {
			// Object wasn't inside before. -> "enter"
			if( refIndex < 0 ) {
				if( ref ) {
					this._insideRefs.push( ref );
				}

				this.fire( 'enter', ref );
			}
			// Object is already inside. -> "stay"
			else {
				this.fire( 'stay', ref );
			}
		}
		// Object is not inside trigger area.
		else {
			// Object was inside before. -> "leave"
			if( refIndex >= 0 ) {
				this._insideRefs.splice( refIndex, 1 );
				this.fire( 'leave', ref );
			}
		}

		return isInside;
	}


	/**
	 * Fire an event for this trigger.
	 * @param {string}  eventType
	 * @param {?object} ref
	 */
	fire( eventType, ref ) {
		let ev = new Event( eventType, { cancelable: true } );
		ev.sc_trigger = this;
		ev.sc_reference = ref;

		if( this._handlersOn[eventType] ) {
			let list = this._handlersOn[eventType];

			for( let i = 0; i < list.length; i++ ) {
				if( ev.defaultPrevented ) {
					break;
				}

				let cb = list[i];
				cb( ev );
			}
		}

		if( this._handlersOnce[eventType] ) {
			let list = this._handlersOnce[eventType];
			let remove = [];

			for( let i = 0; i < list.length; i++ ) {
				if( ev.defaultPrevented ) {
					break;
				}

				remove.push( i );

				let cb = list[i];
				cb( ev );
			}

			for( let i = remove.length - 1; i >= 0; i-- ) {
				let index = remove[i];
				list.splice( index, 1 );
			}
		}
	}


	/**
	 * Remove all or a specific event handler.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	off( eventType, fn ) {
		if( typeof fn !== 'function' ) {
			delete this._handlersOn[eventType];
			delete this._handlersOnce[eventType];
		}
		else {
			let list = this._handlersOn[eventType];
			let index = list.indexOf( fn );

			if( index >= 0 ) {
				list.splice( index, 1 );
			}

			list = this._handlersOnce[eventType];
			index = list.indexOf( fn );

			if( index >= 0 ) {
				list.splice( index, 1 );
			}
		}
	}


	/**
	 * Add an event handler.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	on( eventType, fn ) {
		this._handlersOn[eventType] = this._handlersOn[eventType] || [];
		this._handlersOn[eventType].push( fn );
	}


	/**
	 * Add an event handler for a certain event type.
	 * Removes the handler after the first time it was called.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	once( eventType, fn ) {
		this._handlersOnce[eventType] = this._handlersOnce[eventType] || [];
		this._handlersOnce[eventType].push( fn );
	}


	/**
	 * Get the trigger type.
	 * @return {number}
	 */
	get type() {
		return this._type;
	}


	/**
	 *
	 * @param {number} dt
	 */
	updateTime( dt ) {
		// TODO: update cooldown timer if necessary
	}


}


SlimeCore_Event_Trigger.SHAPE = {
	CIRCLE: 1,
	RECTANGLE: 2
};

SlimeCore_Event_Trigger.TYPE = {
	AREA: 1,
	DISTANCE: 2
};

SlimeCore.Event.Trigger = SlimeCore_Event_Trigger;

}
