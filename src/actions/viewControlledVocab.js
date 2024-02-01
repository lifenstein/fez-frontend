import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { VOCAB_API, VOCAB_LIST_API, CHILD_VOCAB_LIST_API } from 'repositories/routes';

/**
 * Load Top Controlled Vocabulary List
 *
 * @returns {action}
 */
export function loadControlledVocabList() {
    return dispatch => {
        dispatch({ type: actions.VIEW_VOCAB_LOADING });

        return get(VOCAB_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.VIEW_VOCAB_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}

/**
 * Load Child Controlled Vocabulary List
 *
 * @returns {action}
 */
export function loadChildVocabList({ pid: parentId }) {
    console.log('parentId=', parentId);
    return dispatch => {
        dispatch({ type: actions.VIEW_CHILD_VOCAB_LOADING });

        return get(CHILD_VOCAB_LIST_API(parentId))
            .then(response => {
                console.log('response=', response);
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}

export function setOpenedVocab(rowObject) {
    return dispatch => {
        dispatch({
            type: actions.SET_OPENED_VOCAB,
            payload: {
                id: rowObject.id,
                open: rowObject.open,
            },
        });
    };
}

export function addControlledVocabulary(request) {
    return dispatch => {
        dispatch({ type: actions.VOCAB_ADMIN_BUSY });
        return post(VOCAB_API(), request)
            .then(response => {
                dispatch({
                    type: actions.VOCAB_ADMIN_SUCCESS,
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VOCAB_ADMIN_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
