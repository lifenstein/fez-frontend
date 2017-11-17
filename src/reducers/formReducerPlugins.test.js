import * as plugins from './formReducerPlugins';
import {actionTypes} from 'redux-form';
import {Map} from 'immutable';

describe('Form reducer plugin', () => {
    it('resetValue should reset field value', () => {
        const state = Map({
            values: Map({
                'rek_title': 'ABC',
                'fez_record_search_key_a': Map({
                    'a': 'some value'
                })
            }),
            registeredFields: Map({
                'rek_title': Map({
                    name: 'rek_title'
                }),
                'fez_record_search_key_a.a': Map({
                    name: 'fez_record_search_key_a.a'
                })
            }),
            fields: Map({
                rek_title: Map({
                    touched: true,
                    visited: true
                }),
                fez_record_search_key_a: Map({
                    a: Map({
                        touched: true,
                        visited: true
                    })
                })
            })
        });

        const action = {
            type: actionTypes.UNREGISTER_FIELD,
            payload: {
                name: 'fez_record_search_key_a.a'
            }
        };

        let nextState = plugins.resetValue(state, {type: 'SOME_OTHER_TYPE'});
        expect(nextState).toEqual(state);

        nextState = plugins.resetValue(nextState, action);

        expect(nextState.get('values').get(action.payload.name)).toBeUndefined();
        expect(nextState.get('registeredFields').has(action.payload.name)).toBeFalsy();
        expect(nextState.get('fields').has(action.payload.name.split('.').shift())).toBeFalsy();
    });
});
