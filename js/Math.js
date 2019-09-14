'use strict';


/**
 * @namespace SlimeCore.Math
 */
SlimeCore.Math = {


	/**
	 * Find the intersection point of two lines.
	 * @param  {object} p0 - A point on line A.
	 * @param  {object} q0 - Another point on line A.
	 * @param  {object} p1 - A point on line B.
	 * @param  {object} q1 - Another point on line B.
	 * @return {(object|boolean)} The intersection point (x, y) or false if the lines are parallel.
	 */
	lineIntersection( p0, q0, p1, q1 ) {
		let div = ( q1.y - p1.y ) * ( q0.x - p0.x ) - ( q0.y - p0.y ) * ( q1.x - p1.x );

		if( Math.abs( div ) < 0.001 ) {
			return false;
		}

		let sx = ( q1.x - p1.x ) * ( q0.x * p0.y - p0.x * q0.y );
		sx -= ( q0.x - p0.x ) * ( q1.x * p1.y - p1.x * q1.y );
		sx /= div;

		let sy = ( p0.y - q0.y ) * ( q1.x * p1.y - p1.x * q1.y );
		sx -= ( p1.y - q1.y ) * ( q0.x * p0.y - p0.x * q0.y );
		sy /= div;

		return {
			x: sx,
			y: sy
		};
	},


	/**
	 * Check if two axis-aligned bounding boxes overlap.
	 * @param  {object} a   - An axis-aligned bounding box.
	 * @param  {number} a.h - Height.
	 * @param  {number} a.w - Width.
	 * @param  {number} a.x - Position on X axis.
	 * @param  {number} a.y - Position on Y axis.
	 * @param  {object} b   - An axis-aligned bounding box.
	 * @param  {number} b.h - Height.
	 * @param  {number} b.w - Width.
	 * @param  {number} b.x - Position on X axis.
	 * @param  {number} b.y - Position on Y axis.
	 * @return {boolean}
	 */
	overlapAABBWithAABB( a, b ) {
		let overlapX = Math.min( a.x + a.w, b.x + b.w ) - Math.max( a.x, b.x );
		overlapX = ( overlapX < 0 ) ? 0 : overlapX;

		let overlapY = Math.min( a.y + a.h, b.y + b.h ) - Math.max( a.y, b.y );
		overlapY = ( overlapY < 0 ) ? 0 : overlapY;

		return ( overlapX * overlapY > 0 );
	},


	/**
	 * Check if an axis-aligned bound box and a circle overlap.
	 * @param  {object} aabb     - An axis-aligned bounding box.
	 * @param  {number} aabb.h   - Height.
	 * @param  {number} aabb.w   - Width.
	 * @param  {number} aabb.x   - Position on X axis.
	 * @param  {number} aabb.y   - Position on Y axis.
	 * @param  {object} circle   - A circle.
	 * @param  {number} circle.r - Radius.
	 * @param  {number} circle.x - Center on X axis.
	 * @param  {number} circle.y - Center on Y axis.
	 * @return {boolean}
	 */
	overlapAABBWithCircle( aabb, circle ) {
		// Find the point on the AABB closest to the circle center.
		let rectNearestX = Math.max( aabb.x, Math.min( circle.x, aabb.x + aabb.w ) );
		let rectNearestY = Math.max( aabb.y, Math.min( circle.y, aabb.y + aabb.h ) );

		// Set the found point relative to the circle center.
		let dtX = rectNearestX - circle.x;
		let dtY = rectNearestY - circle.y;

		// Normaly this would be the euclidean distance. But we can
		// omit the square root, because we compare it against another
		// euclidean distance.
		let distRectPoint = dtX * dtX + dtY * dtY;
		let distCircle = circle.r * circle.r;

		// Check if the distance of the rectangle point to the circle
		// center is smaller than the distance of the circle radius.
		return ( distRectPoint < distCircle );
	}


};
