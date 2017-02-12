'use strict';


SlimeCore.Math = {


	/**
	 * Test if two AABBs overlap.
	 * @param  {Object}  a
	 * @param  {Object}  b
	 * @return {Boolean}
	 */
	collisionTest2D: function( a, b ) {
		var xOverlap = Math.max( 0.0, Math.min( a.x1, b.x1 ) - Math.max( a.x0, b.x0 ) );
		var yOverlap = Math.max( 0.0, Math.min( a.y1, b.y1 ) - Math.max( a.y0, b.y0 ) );

		return ( xOverlap * yOverlap > 0.0 );
	},


	/**
	 * Find the intersection point of two lines.
	 * @param  {Object}         p0 A point on line A.
	 * @param  {Object}         q0 Another point on line A.
	 * @param  {Object}         p1 A point on line B.
	 * @param  {Object}         q1 Another point on line B.
	 * @return {Object|Boolean}    The intersection point (x, y) or false if the lines are parallel.
	 */
	lineIntersection2D: function( p0, q0, p1, q1 ) {
		var div = ( q1.y - p1.y ) * ( q0.x - p0.x ) - ( q0.y - p0.y ) * ( q1.x - p1.x );

		if( Math.abs( div ) < 0.001 ) {
			return false;
		}

		var indDiv = 1.0 / div;

		var sx = ( q1.x - p1.x ) * ( q0.x * p0.y - p0.x * q0.y );
		sx -= ( q0.x - p0.x ) * ( q1.x * p1.y - p1.x * q1.y );
		sx *= invDiv;

		var sy = ( p0.y - q0.y ) * ( q1.x * p1.y - p1.x * q1.y );
		sx -= ( p1.y - q1.y ) * ( q0.x * p0.y - p0.x * q0.y );
		sy *= invDiv;

		return {
			x: sx,
			y: sy
		};
	}


};
