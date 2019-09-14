'use strict';


{

/**
 * @alias SlimeCore.Event.Trigger
 */
class SlimeCore_Event_Trigger {


	/**
	 *
	 * @alias SlimeCore.Event.Trigger
	 * @class
	 * @param {number} type              - A value from SlimeCore.Event.Trigger.TYPE.
	 * @param {object} params
	 * @param {object} params.typeParams
	 */
	constructor( type, params ) {
		this._type = type;
		this._typeParams = {};

		this._handlersOn = {};
		this._handlersOnce = {};

		this.isEnabled = true;
	}


	/**
	 * Fire an event for this trigger.
	 * @param {string}  eventType
	 * @param {?object} ref
	 */
	fire( eventType, ref ) {
		let ev = new Event( eventType, { cancelable: true } );
		ev.sc_trigger = this;
		ev.sc_reference = ref;

		let listOn = this._handlersOn[eventType];
		let listOnce = this._handlersOnce[eventType];

		if( listOn ) {
			for( let i = 0; i < listOn.length; i++ ) {
				if( ev.defaultPrevented ) {
					break;
				}

				let cb = listOn[i];
				cb( ev );
			}
		}

		if( listOnce ) {
			let remove = [];

			for( let i = 0; i < listOnce.length; i++ ) {
				if( ev.defaultPrevented ) {
					break;
				}

				remove.push( i );

				let cb = listOnce[i];
				cb( ev );
			}

			for( let i = remove.length - 1; i >= 0; i-- ) {
				let index = remove[i];
				listOnce.splice( index, 1 );
			}
		}
	}


	/**
	 * Remove all or a specific event handler.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	off( eventType, fn ) {
		if( typeof fn !== 'function' ) {
			delete this._handlersOn[eventType];
			delete this._handlersOnce[eventType];
		}
		else {
			let listOn = this._handlersOn[eventType];
			let index = listOn.indexOf( fn );

			if( index >= 0 ) {
				listOn.splice( index, 1 );
			}

			let listOnce = this._handlersOnce[eventType];
			index = listOnce.indexOf( fn );

			if( index >= 0 ) {
				listOnce.splice( index, 1 );
			}
		}
	}


	/**
	 * Add an event handler.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	on( eventType, fn ) {
		this._handlersOn[eventType] = this._handlersOn[eventType] || [];
		this._handlersOn[eventType].push( fn );
	}


	/**
	 * Add an event handler for a certain event type.
	 * Removes the handler after the first time it was called.
	 * @param {string}   eventType
	 * @param {function} fn
	 */
	once( eventType, fn ) {
		this._handlersOnce[eventType] = this._handlersOnce[eventType] || [];
		this._handlersOnce[eventType].push( fn );
	}


	/**
	 * Get the trigger type.
	 * @return {number}
	 */
	get type() {
		return this._type;
	}


}


SlimeCore_Event_Trigger.EVENT = {
	AREA_ENTER: 'enter',
	AREA_LEAVE: 'leave',
	AREA_STAY: 'stay',
	TIMER_END: 'timer_end',
	TIMER_UPDATE: 'timer_update'
};

SlimeCore_Event_Trigger.SHAPE = {
	CIRCLE: 1,
	RECTANGLE: 2
};

SlimeCore_Event_Trigger.TYPE = {
	AREA: 1,
	DISTANCE: 2,
	TIMER: 3
};

SlimeCore.Event.Trigger = SlimeCore_Event_Trigger;

}
