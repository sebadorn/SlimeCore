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
	}


};
