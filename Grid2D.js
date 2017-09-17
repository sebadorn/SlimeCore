'use strict';


{

class SlimeCore_Grid2D {


	/**
	 * A 2D grid for use as acceleration structure.
	 * @constructor
	 * @param {Object} options
	 */
	constructor( options ) {
		options = options || {};

		this.width = options.width || 100;
		this.height = options.height || 100;
		this.tileWidth = options.tileWidth || 10;
		this.tileHeight = options.tileHeight || 10;

		this.clear();
	}


	/**
	 * Create the tiles.
	 */
	_calculateTiles() {
		this.numTilesX = Math.ceil( this.width / this.tileWidth );
		this.numTilesY = Math.ceil( this.height / this.tileHeight );

		this.tiles = [];

		for( let y = 0; y < this.numTilesY; y++ ) {
			let arr = [];

			for( let x = 0; x < this.numTilesX; x++ ) {
				arr.push( [] );
			}

			this.tiles.push( arr );
		}
	}


	/**
	 * Populate the grid. Tiles will not be cleared beforehand
	 * and no checks for duplicates will be performed.
	 * @param {Array<Object>} objects
	 */
	add( objects ) {
		this._population = this._population.concat( objects );

		var invTileW = 1.0 / this.tileWidth;
		var invTileH = 1.0 / this.tileHeight;

		for( let i = 0; i < objects.length; i++ ) {
			let o = objects[i];
			let data = this.fnGetPosAndSize( o );

			let xIndexMin = ~~( data.x * invTileW );
			let xIndexMax = ~~( ( data.x + data.width ) * invTileW );
			let yIndexMin = ~~( data.y * invTileH );
			let yIndexMax = ~~( (data.y + data.height ) * invTileH );

			o.__scGrid2DTiles = [];

			for( let y = yIndexMin; y <= yIndexMax; y++ ) {
				for( let x = xIndexMin; x <= xIndexMax; x++ ) {
					if( !this.tiles[y] || !this.tiles[y][x] ) {
						continue;
					}

					this.tiles[y][x].push( o );
					o.__scGrid2DTiles.push( this.tiles[y][x] );
				}
			}
		}
	}


	/**
	 * Clear all tiles and reset the population.
	 */
	clear() {
		this._population = [];
		this._calculateTiles();
	}


	/**
	 * Get the position and size of a population object.
	 * Has to be implemented by application.
	 * @param  {Object} o Object of the population.
	 * @return {Object}   Plain object with the following attributes: x, y, width, height
	 */
	fnGetPosAndSize( o ) {
		throw new Error(
			'[SlimeCore.Grid2D.fnGetPosAndSize]' +
			' Function not set by application.'
		);
	}


	/**
	 * Get the tiles which contain the given object.
	 * @param  {Object}        o
	 * @return {Array<Object>}
	 */
	getContainingTiles( o ) {
		return o.__scGrid2DTiles || [];
	}


	/**
	 * Resize the grid.
	 * @param {Number} w
	 * @param {Number} h
	 */
	resize( w, h ) {
		this.width = w;
		this.height = h;

		this._calculateTiles();
		this.populate( this._population );
	}


	/**
	 * Update the associations of objects to tiles.
	 */
	updatePopulation() {
		for( let i = 0; i < this._population.length; i++ ) {
			let o = this._population[i];
			let data = this.fnGetPosAndSize( o );
		}
	}


	updateTilesOfObject( o ) {
		var data = this.fnGetPosAndSize( o );
		var invTileW = 1.0 / this.tileWidth;
		var invTileH = 1.0 / this.tileHeight;

		var xIndexMin = ~~( data.x * invTileW );
		var xIndexMax = ~~( ( data.x + data.width ) * invTileW );
		var yIndexMin = ~~( data.y * invTileH );
		var yIndexMax = ~~( (data.y + data.height ) * invTileH );

		for( let i = 0; i < o.__scGrid2DTiles.length; i++ ) {
			let tile = o.__scGrid2DTiles[i];

			for( let j = 0; j < tile.length; j++ ) {
				if( tile[j] === o ) {
					tile.splice( j, 1 );
					break;
				}
			}
		}

		o.__scGrid2DTiles = [];

		for( let y = yIndexMin; y <= yIndexMax; y++ ) {
			for( let x = xIndexMin; x <= xIndexMax; x++ ) {
				if( !this.tiles[y] || !this.tiles[y][x] ) {
					continue;
				}

				this.tiles[y][x].push( o );
				o.__scGrid2DTiles.push( this.tiles[y][x] );
			}
		}
	}


}


SlimeCore.Grid2D = SlimeCore_Grid2D;

}
