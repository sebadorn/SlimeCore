'use strict';


{

const SCTrigger = SlimeCore.Event.Trigger;


class SlimeCore_Event_TimerTrigger extends SCTrigger {


	/**
	 *
	 * @constructor
	 * @param {object}    params
	 * @param {number}    params.interval
	 * @param {?boolean} [params.loop = false]
	 * @param {?number}   params.updateOnEach
	 */
	constructor( params ) {
		super( SCTrigger.TYPE.TIMER, params );

		this._interval = 0;
		this._loop = false;
		this._updateOnEach = 0;

		this._hasEnded = false;
		this._lastUpdate = 0;
		this._timeProgress = 0;

		this._setParams( params );
	}


	/**
	 * Set the params depending on type.
	 * @override
	 * @private
	 * @param {object}    params
	 * @param {number}    params.interval
	 * @param {?boolean} [params.loop = false]
	 * @param {?number}   params.updateOnEach
	 */
	_setParams( params ) {
		const Utils = SlimeCore.Utils;

		if( !Utils.isObject( params ) ) {
			params = {};
		}

		if( Utils.isNumber( params.interval ) && params.interval > 0 ) {
			this._interval = params.interval;
		}

		if( typeof params.loop === 'boolean' ) {
			this._loop = params.loop;
		}

		if( Utils.isNumber( params.updateOnEach ) && params.updateOnEach >= 0 ) {
			this._updateOnEach = params.updateOnEach;
		}
	}


	/**
	 * Update the time.
	 * @param {number} timeStep
	 */
	updateTime( timeStep ) {
		if( this._hasEnded ) {
			return;
		}

		const SCE = SlimeCore.Event.Trigger.EVENT;

		this._timeProgress += timeStep;

		if( this._updateOnEach > 0 ) {
			let diff = this._timeProgress - this._lastUpdate;

			if( diff >= this._updateOnEach ) {
				this._lastUpdate += this._updateOnEach;

				this.fire( SCE.TIMER_UPDATE, { time: this._lastUpdate } );
			}
		}

		if( this._timeProgress >= this._interval ) {
			this._hasEnded = !this._loop;
			this._lastUpdate = 0;
			this._timeProgress = 0;

			this.fire( SCE.TIMER_END );
		}
	}


}


SlimeCore.Event.TimerTrigger = SlimeCore_Event_TimerTrigger;

}
