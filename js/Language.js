'use strict';


/**
 * @namespace SlimeCore.Language
 */
SlimeCore.Language = {


	_lang: null,


	langDict: {},


	/**
	 * Try to auto-detect the system language.
	 * @return {?string} The detected language or null.
	 */
	autoDetectLanguage() {
		let l = null;
		let procLang = null;
		let navLang = window.navigator.language;

		if( typeof process !== 'undefined' && SlimeCore.Utils.isObject( process.env ) ) {
			procLang = process.env.LANG || process.env.LANGUAGE;

			if( typeof procLang === 'string' ) {
				l = procLang.substr( 0, 2 );
			}
		}

		if( !l && typeof navLang === 'string' ) {
			l = navLang.substr( 0, 2 );
		}

		if( typeof l === 'string' ) {
			return l.toLowerCase();
		}

		return null;
	},


	/**
	 * Get the set language.
	 * @return {?string}
	 */
	getLanguage() {
		return this._lang;
	},


	/**
	 * Load a language file.
	 * @param  {string} filepath - File path of the config file (written in JSON format.)
	 * @param  {string} key      - Language key, like "de" or "en".
	 * @return {number} Error code.
	 *     0: Good.
	 *     1: Error on reading file.
	 *     2: Error on parsing file.
	 */
	load( filepath, key ) {
		let data = null;

		try {
			data = SlimeCore.Utils.loadAndParseJSONFile( filepath );
		}
		catch( errorCode ) {
			return errorCode;
		}

		this.langDict[key] = data;

		return SlimeCore.ERROR.NONE;
	},


	/**
	 * Set the language to use.
	 * @param {string} l Language key.
	 */
	setLanguage( l ) {
		this._lang = l;
	},


	/**
	 * Get the translation for a key.
	 * @param  {string} key           - Key to get translation for.
	 * @param  {string} fallbackValue - Fallback value to return if no translation found. Defaults to the key.
	 * @param  {string} lang          - Language to translate into. Defaults to the set one.
	 * @return {string} Translation.
	 */
	t( key, fallbackValue = null, lang = null ) {
		lang = lang || this._lang;

		let dict = this.langDict[lang];
		let val = null;

		if( SlimeCore.Utils.isObject( dict ) ) {
			val = dict[key];
		}

		if( val !== null && typeof val !== 'undefined' ) {
			return val;
		}

		if( fallbackValue !== null && typeof fallbackValue !== 'undefined' ) {
			return fallbackValue;
		}

		return key;
	},


	/**
	 * Unload/delete a language dictionary.
	 * @param {string} lang
	 */
	unload( lang ) {
		if( this.langDict[lang] ) {
			delete this.langDict[lang];
		}

		if( lang === this._lang ) {
			this._lang = null;
		}
	}


};
