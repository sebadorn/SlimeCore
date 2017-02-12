'use strict';


/**
 * A 2D grid for use as acceleration structure.
 * @param {Object} options
 */
SlimeCore.Grid2D = function( options ) {
	options = options || {};

	this.width = options.width || 100;
	this.height = options.height || 100;
	this.tileWidth = options.tileWidth || 10;
	this.tileHeight = options.tileHeight || 10;

	this.clear();
};


SlimeCore.Grid2D.prototype = {


	/**
	 * Create the tiles.
	 */
	_calculateTiles: function() {
		this.numTilesX = Math.ceil( this.width / this.tileWidth );
		this.numTilesY = Math.ceil( this.height / this.tileHeight );

		this.tiles = [];

		for( var y = 0; y < this.numTilesY; y++ ) {
			var arr = [];

			for( var x = 0; x < this.numTilesX; x++ ) {
				arr.push( [] );
			}

			this.tiles.push( arr );
		}
	},


	/**
	 * Populate the grid. Tiles will not be cleared beforehand
	 * and no checks for duplicates will be performed.
	 * @param {Array<Object>} objects
	 */
	add: function( objects ) {
		this._population = this._population.concat( objects );

		var invTileW = 1.0 / this.tileWidth;
		var invTileH = 1.0 / this.tileHeight;

		for( var i = 0; i < objects.length; i++ ) {
			var o = objects[i];
			var data = this.fnGetPosAndSize( o );

			var xIndexMin = ~~( data.x * invTileW );
			var xIndexMax = ~~( ( data.x + data.width ) * invTileW );
			var yIndexMin = ~~( data.y * invTileH );
			var yIndexMax = ~~( (data.y + data.height ) * invTileH );

			o.__scGrid2DTiles = [];

			for( var y = yIndexMin; y <= yIndexMax; y++ ) {
				for( var x = xIndexMin; x <= xIndexMax; x++ ) {
					if( !this.tiles[y] || !this.tiles[y][x] ) {
						continue;
					}

					this.tiles[y][x].push( o );
					o.__scGrid2DTiles.push( this.tiles[y][x] );
				}
			}
		}
	},


	/**
	 * Clear all tiles and reset the population.
	 */
	clear: function() {
		this._population = [];
		this._calculateTiles();
	},


	/**
	 * Get the position and size of a population object.
	 * Has to be implemented by application.
	 * @param  {Object} o Object of the population.
	 * @return {Object}   Plain object with the following attributes: x, y, width, height
	 */
	fnGetPosAndSize: function( o ) {
		throw new Error(
			'[SlimeCore.Grid2D.fnGetPosAndSize]' +
			' Function not set by application.'
		);
	},


	/**
	 * Get the tiles which contain the given object.
	 * @param  {Object}        o
	 * @return {Array<Object>}
	 */
	getContainingTiles: function( o ) {
		return o.__scGrid2DTiles || [];
	},


	/**
	 * Resize the grid.
	 * @param {Number} w
	 * @param {Number} h
	 */
	resize: function( w, h ) {
		this.width = w;
		this.height = h;

		this._calculateTiles();
		this.populate( this._population );
	},


	/**
	 * Update the associations of objects to tiles.
	 */
	updatePopulation: function() {
		for( var i = 0; i < this._population.length; i++ ) {
			var o = this._population[i];
			var data = this.fnGetPosAndSize( o );
		}
	},


	updateTilesOfObject: function( o ) {
		var data = this.fnGetPosAndSize( o );
		var invTileW = 1.0 / this.tileWidth;
		var invTileH = 1.0 / this.tileHeight;

		var xIndexMin = ~~( data.x * invTileW );
		var xIndexMax = ~~( ( data.x + data.width ) * invTileW );
		var yIndexMin = ~~( data.y * invTileH );
		var yIndexMax = ~~( (data.y + data.height ) * invTileH );

		for( var i = 0; i < o.__scGrid2DTiles.length; i++ ) {
			var tile = o.__scGrid2DTiles[i];

			for( var j = 0; j < tile.length; j++ ) {
				if( tile[j] === o ) {
					tile.splice( j, 1 );
					break;
				}
			}
		}

		o.__scGrid2DTiles = [];

		for( var y = yIndexMin; y <= yIndexMax; y++ ) {
			for( var x = xIndexMin; x <= xIndexMax; x++ ) {
				if( !this.tiles[y] || !this.tiles[y][x] ) {
					continue;
				}

				this.tiles[y][x].push( o );
				o.__scGrid2DTiles.push( this.tiles[y][x] );
			}
		}
	}


};
