'use strict';


{

/**
 * A class to wait for web fonts to load. The @font-face
 * CSS has to already be included in the page.
 *
 * This class will add HTML to the page out of view to
 * trigger the font files to be loaded into the browser.
 * Without visible text on the page this would not
 * happen. But it can be in a container outside of the
 * viewable area.
 *
 * However fonts which have already been loaded will not
 * trigger the event again. For this case a timeout
 * should be provided as well.
 * @alias SlimeCore.FontLoader
 */
class SlimeCore_FontLoader {


	/**
	 * FontLoader.
	 * @alias SlimeCore.FontLoader
	 * @class
	 * @param {object[]} fonts
	 * @param {?object}  options - Optional.
	 */
	constructor( fonts, options ) {
		this._fonts = fonts;
		this._timedOut = false;

		this._setOptions( options );
	}


	/**
	 * Create the HTML.
	 * @private
	 * @return {HTMLElement}
	 */
	_createHTML() {
		let node = document.createElement( 'div' );
		node.id = 'sc-font-preload';
		node.style.position = 'absolute';
		node.style.right = '1000px';
		node.style.bottom = '1000px';

		if( this._options.cssClass ) {
			node.setAttribute( 'class', this._options.cssClass );
		}

		for( let i = 0; i < this._fonts.length; i++ ) {
			let f = this._fonts[i];

			let fontNode = document.createElement( 'p' );
			fontNode.style.fontFamily = f.family;
			fontNode.textContent = '.';

			if( f.style ) {
				fontNode.style.fontStyle = f.style;
			}

			if( f.weight ) {
				fontNode.style.fontWeight = f.weight;
			}

			node.appendChild( fontNode );
		}

		return node;
	}


	/**
	 * Set the timeout for the loading process.
	 * @private
	 * @param {?function} cb - Callback.
	 */
	_setLoadTimeout( cb ) {
		let timeoutID = null;

		if(
			typeof this._options.timeout !== 'number' ||
			this._options.timeout < 0
		) {
			return timeoutID;
		}

		let timeout = this._options.timeout;

		timeoutID = setTimeout( () => {
			this._timedOut = true;

			let err = new Error( `SlimeCore.FontLoader timed out after ${timeout} ms.` );
			cb && cb( err, null );
		}, this._options.timeout );

		return timeoutID;
	}


	/**
	 * Set the options.
	 * @private
	 * @param {object} options
	 */
	_setOptions( options ) {
		this._options = {
			container: document.body,
			cssClass: null,
			timeout: null
		};

		const Utils = SlimeCore.Utils;

		if( !Utils.isObject( options ) ) {
			return;
		}

		if( options.container ) {
			this._options.container = options.container;
		}

		if( typeof options.cssClass === 'string' ) {
			this._options.cssClass = options.cssClass;
		}

		if( Utils.isNumber( options.timeout ) ) {
			this._options.timeout = options.timeout;
		}
	}


	/**
	 * Wait for the fonts to load.
	 * @param {function} cb - Callback.
	 */
	waitForLoadingDone( cb ) {
		let hasFired = false;
		let node = this._createHTML();
		this._options.container.appendChild( node );

		let timeout = this._setLoadTimeout( cb );

		document.fonts.onloadingdone = ( fontFaceSetEvent ) => {
			if( hasFired ) {
				SlimeCore.Log.warn( '[SlimeCore.FontLoader.load]' +
					' Event "onloadingdone" has already been fired.' );
				return;
			}

			hasFired = true;

			if( this._timedOut ) {
				SlimeCore.Log.warn( '[SlimeCore.FontLoader.load] Event "onloadingdone" fired,' +
					' but listener already timed out.' );
				return;
			}

			clearTimeout( timeout );

			SlimeCore.Log.debug( '[SlimeCore.FontLoader.load]' +
				` Loaded ${fontFaceSetEvent.fontfaces.length} FontFaces.` );

			cb && cb( null, fontFaceSetEvent );
		};
	}


}


SlimeCore.FontLoader = SlimeCore_FontLoader;

}
