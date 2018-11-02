'use strict';


{

class SlimeCore_Event_Group {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this._triggers = [];

		this.aabb = {
			x: -Infinity,
			y: -Infinity,
			w: 0,
			h: 0
		};
	}


	/**
	 * Add a trigger to the group.
	 * @param {SlimeCore.Event.Trigger} trigger
	 */
	add( trigger ) {
		if( trigger instanceof SlimeCore.Event.Trigger ) {
			this._triggers.push( trigger );
			this.extendBoundingBox( trigger );
		}
		else {
			throw new Error( 'Expected value to be an instance of SlimeCore.Event.Trigger.' );
		}
	}


	/**
	 * Calculate the axis-aligned bounding box.
	 * @return {object} The axis-aligned bounding box of the group.
	 */
	calculateBoundingBox() {
		let maxX = -Infinity;
		let maxY = -Infinity;

		for( let i = 0; i < this._triggers.length; i++ ) {
			let trigger = this._triggers[i];
			const aabb = trigger.aabb;

			this.aabb.x = ( aabb.x < this.aabb.x ) ? aabb.x: this.aabb.x;
			this.aabb.y = ( aabb.y < this.aabb.y ) ? aabb.y: this.aabb.y;

			maxX = Math.max( aabb.x + aabb.w, maxX );
			maxY = Math.max( aabb.y + aabb.h, maxY );
		}

		this.aabb.w = maxX - this.aabb.x;
		this.aabb.h = maxY - this.aabb.y;

		return this.aabb;
	}


	/**
	 * Check if an object fulfills the condition of a trigger.
	 * @param {object} aabb
	 * @param {number} aabb.x
	 * @param {number} aabb.y
	 * @param {number} aabb.w
	 * @param {number} aabb.h
	 */
	checkTriggers( aabb ) {
		for( let i = 0; i < this._triggers.length; i++ ) {
			let trigger = this._triggers[i];
			trigger.check( aabb );
		}
	}


	/**
	 * Extend the axis-aligned bounding box with a given trigger.
	 * @param  {SlimeCore.Event.Trigger} trigger
	 * @return {object} The axis-aligned bounding box of the group.
	 */
	extendBoundingBox( trigger ) {
		const aabb = trigger.aabb;

		if( this.aabb.x === -Infinity ) {
			this.aabb.x = aabb.x;
			this.aabb.y = aabb.y;
			this.aabb.w = aabb.w;
			this.aabb.h = aabb.h;
		}
		else {
			let maxX = Math.max( aabb.x + aabb.w, this.aabb.x + this.aabb.w );
			let maxY = Math.max( aabb.y + aabb.h, this.aabb.y + this.aabb.h );

			this.aabb.x = ( aabb.x < this.aabb.x ) ? aabb.x: this.aabb.x;
			this.aabb.y = ( aabb.y < this.aabb.y ) ? aabb.y: this.aabb.y;

			this.aabb.w = maxX - this.aabb.x;
			this.aabb.h = maxY - this.aabb.y;
		}

		return this.aabb;
	}


	/**
	 * Check if the group's AABB overlaps with a given AABB.
	 * @param  {object} aabb   - Axis-aligned bounding box.
	 * @param  {number} aabb.h - Height.
	 * @param  {number} aabb.w - Width.
	 * @param  {number} aabb.x - X position.
	 * @param  {number} aabb.y - Y position.
	 * @return {boolean} True if overlap, false otherwise.
	 */
	overlapsWith( aabb ) {
		let overlapX = Math.min( this.aabb.x + this.aabb.w, aabb.x + aabb.w ) - Math.max( this.aabb.x, aabb.x );
		overlapX = ( overlapX < 0 ) ? 0 : overlapX;

		let overlapY = Math.min( this.aabb.y + this.aabb.h, aabb.y + aabb.h ) - Math.max( this.aabb.y, aabb.y );
		overlapY = ( overlapY < 0 ) ? 0 : overlapY;

		return ( overlapX * overlapY > 0 );
	}


	/**
	 *
	 * @param {number} dt
	 */
	updateTime( dt ) {
		for( let i = 0; i < this._triggers.length; i++ ) {
			this._triggers[i].updateTime( dt );
		}
	}


}


SlimeCore.Event.Group = SlimeCore_Event_Group;

}
