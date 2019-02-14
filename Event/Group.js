'use strict';


{

class SlimeCore_Event_Group {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this._triggers = [];
		this._triggersWithLeaveEvent = null;

		this.aabb = {
			x: -Infinity,
			y: -Infinity,
			w: 0,
			h: 0
		};
	}


	/**
	 * Add a trigger to the group.
	 * @param  {SlimeCore.Event.Trigger} trigger
	 * @throws {Error} If trigger argument is not an instance of SlimeCore.Event.Trigger.
	 */
	add( trigger ) {
		if( trigger instanceof SlimeCore.Event.Trigger ) {
			this._triggers.push( trigger );

			if( trigger.group ) {
				trigger.group.remove( trigger );
			}

			trigger.group = this;

			if( trigger.hasLeaveEventListener() ) {
				this.registerLeaveEventTrigger( trigger );
			}

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
	 * Check first if the hitbox is inside the group,
	 * and if so, check the triggers inside.
	 * @param {object}  aabb   - Axis-aligned bounding box.
	 * @param {number}  aabb.x - X coordinate.
	 * @param {number}  aabb.y - Y coordinate.
	 * @param {number}  aabb.w - Width.
	 * @param {number}  aabb.h - Height.
	 * @param {?object} ref    - Object reference of the thing being checked.
	 *     Used for comparisons to determine which events to fire.
	 */
	check( aabb, ref ) {
		if( this.overlapsWith( aabb ) ) {
			this.checkTriggers( aabb, ref );
		}
		else if( this._triggersWithLeaveEvent ) {
			for( let i = 0; i < this._triggersWithLeaveEvent.length; i++ ) {
				let trigger = this._triggersWithLeaveEvent[i];
				trigger.fireEventIfReferenceHasLeft( ref );
			}
		}
	}


	/**
	 * Check if an object fulfills the condition of a trigger.
	 * @param {object}  aabb   - Axis-aligned bounding box.
	 * @param {number}  aabb.x - X coordinate.
	 * @param {number}  aabb.y - Y coordinate.
	 * @param {number}  aabb.w - Width.
	 * @param {number}  aabb.h - Height.
	 * @param {?object} ref    - Object reference of the thing being checked.
	 *     Used for comparisons to determine which events to fire.
	 */
	checkTriggers( aabb, ref ) {
		for( let i = 0; i < this._triggers.length; i++ ) {
			let trigger = this._triggers[i];
			trigger.check( aabb, ref );
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
	 * Get the triggers of the group.
	 * @return {SlimeCore.Event.Trigger[]}
	 */
	getTriggers() {
		return this._triggers.slice( 0 );
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
		return SlimeCore.Math.overlapAABBWithAABB( aabb, this.aabb );
	}


	/**
	 *
	 * @param {SlimeCore.Event.Trigger} trigger
	 */
	registerLeaveEventTrigger( trigger ) {
		this._triggersWithLeaveEvent = this._triggersWithLeaveEvent || [];

		if( this._triggersWithLeaveEvent.indexOf( trigger ) < 0 ) {
			this._triggersWithLeaveEvent.push( trigger );
		}
	}


	/**
	 * Remove a trigger from the group.
	 * @param {SlimeCore.Event.Trigger} trigger
	 */
	remove( trigger ) {
		let index = this._triggers.indexOf( trigger );

		if( index >= 0 ) {
			this._triggers.splice( index, 1 );
			this.unregisterLeaveEventTrigger( trigger );
			this.calculateBoundingBox();
		}
	}


	/**
	 *
	 * @param {SlimeCore.Event.Trigger} trigger
	 */
	unregisterLeaveEventTrigger( trigger ) {
		if( !this._triggersWithLeaveEvent ) {
			return;
		}

		let index = this._triggersWithLeaveEvent.indexOf( trigger );

		if( index >= 0 ) {
			this._triggersWithLeaveEvent.splice( index, 1 );
		}
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
