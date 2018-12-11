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
		if( !SlimeCore.Utils.isObject( params ) ) {
			params = {};
		}

		if( !SlimeCore.Utils.isObject( params.typeParams ) ) {
			params.typeParams = {};
		}

		if( typeof params.cooldown === 'number' && params.cooldown > 0 ) {
			this.cooldown = params.cooldown;
		}

		const TYPE = SlimeCore_Event_Trigger.TYPE;
		const tp = params.typeParams;

		if( this._type === TYPE.AREA ) {
			const FORM = SlimeCore_Event_Trigger.FORM;

			this._typeParams = {
				// [px] - left of square/center of circle
				x: 0,
				// [px] - top of square/center of circle
				y: 0,
				// [px] - square
				w: 0,
				// [px] - square
				h: 0,
				// [px] - circle
				r: 0,
				// "square" or "circle"
				form: 'square'
			};

			if( typeof tp.w === 'number' && !isNaN( tp.w ) ) {
				this._typeParams.w = tp.w;
			}

			if( typeof tp.h === 'number' && !isNaN( tp.h ) ) {
				this._typeParams.h = tp.h;
			}

			if( typeof tp.r === 'number' && !isNaN( tp.r ) ) {
				this._typeParams.r = tp.r;
			}

			if( tp.form === FORM.CIRCLE || tp.form === FORM.SQUARE ) {
				this._typeParams.form = tp.form;
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

			if( typeof tp.distance === 'number' && !isNaN( tp.distance ) ) {
				this._typeParams.distance = tp.distance;
			}
		}


		// The same for all types.

		if( typeof tp.x === 'number' && !isNaN( tp.x ) ) {
			this._typeParams.x = tp.x;
		}

		if( typeof tp.y === 'number' && !isNaN( tp.y ) ) {
			this._typeParams.y = tp.y;
		}
	}


	/**
	 * Calculate the axis-align bounding box.
	 * @return {object} The axis-aligned bounding box of the trigger.
	 */
	calculateBoundingBox() {
		const FORM = SlimeCore_Event_Trigger.FORM;
		const TYPE = SlimeCore_Event_Trigger.TYPE;
		const tp = this._typeParams;

		this.aabb.x = tp.x;
		this.aabb.y = tp.y;

		// Type: Area.
		if( this._type === TYPE.AREA ) {
			// Form: Square.
			if( tp.form === FORM.SQUARE ) {
				this.aabb.w = tp.w;
				this.aabb.h = tp.h;
			}
			// Form: Circle.
			else if( tp.form === FORM.CIRCLE ) {
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
	 * @param {object} aabb
	 * @param {number} aabb.x
	 * @param {number} aabb.y
	 * @param {number} aabb.w
	 * @param {number} aabb.h
	 */
	check( aabb ) {
		const TYPE = SlimeCore_Event_Trigger.TYPE;

		if( this._type === TYPE.AREA ) {
			// TODO:
		}
		else if( this._type === TYPE.DISTANCE ) {
			// TODO:
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


SlimeCore_Event_Trigger.FORM = {
	CIRCLE: 1,
	SQUARE: 2
};

SlimeCore_Event_Trigger.TYPE = {
	AREA: 1,
	DISTANCE: 2
};

SlimeCore.Event.Trigger = SlimeCore_Event_Trigger;

}
