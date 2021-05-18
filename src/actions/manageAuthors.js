import {
    AUTHOR_ADDING,
    AUTHOR_ADD_SUCCESS,
    AUTHOR_ADD_FAILED,
    AUTHOR_LIST_LOADING,
    AUTHOR_LIST_LOADED,
    AUTHOR_LIST_FAILED,
    AUTHOR_ITEM_UPDATING,
    AUTHOR_ITEM_UPDATE_SUCCESS,
    AUTHOR_ITEM_UPDATE_FAILED,
    AUTHOR_ITEM_DELETING,
    AUTHOR_ITEM_DELETE_SUCCESS,
    AUTHOR_ITEM_DELETE_FAILED,
    CHECKING_EXISTING_AUTHOR,
    CHECKING_EXISTING_AUTHOR_FAILED,
    EXISTING_AUTHOR_FOUND,
    EXISTING_AUTHOR_NOT_FOUND,
    BULK_AUTHOR_ITEMS_DELETING,
    BULK_AUTHOR_ITEMS_DELETE_SUCCESS,
    BULK_AUTHOR_ITEMS_DELETE_FAILED,
} from './actionTypes';
import { get, put, destroy, post } from 'repositories/generic';
import { AUTHOR_API, MANAGE_AUTHORS_LIST_API, AUTHORS_SEARCH_API } from 'repositories/routes';

export function loadAuthorList({ page, pageSize, search }) {
    return async dispatch => {
        dispatch({ type: AUTHOR_LIST_LOADING });

        try {
            const response = await get(MANAGE_AUTHORS_LIST_API({ page, pageSize, query: search }));
            dispatch({
                type: AUTHOR_LIST_LOADED,
            });
            return Promise.resolve({
                data: response.data,
                page: response.current_page - 1,
                totalCount: response.total,
            });
        } catch (e) {
            dispatch({
                type: AUTHOR_LIST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function updateAuthorListItem(newData) {
    return async dispatch => {
        try {
            dispatch({ type: AUTHOR_ITEM_UPDATING });

            const response = await put(AUTHOR_API({ authorId: newData.aut_id }), {
                ...newData,
            });

            dispatch({
                type: AUTHOR_ITEM_UPDATE_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ITEM_UPDATE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteAuthorListItem(oldData) {
    return async dispatch => {
        dispatch({ type: AUTHOR_ITEM_DELETING });

        try {
            const response = await destroy(AUTHOR_API({ authorId: oldData.aut_id }));
            dispatch({
                type: AUTHOR_ITEM_DELETE_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ITEM_DELETE_FAILED,
                payload: e.data,
            });

            return Promise.reject(e);
        }
    };
}

export function bulkDeleteAuthorListItems(oldData) {
    return async dispatch => {
        dispatch({ type: BULK_AUTHOR_ITEMS_DELETING });
        const authorIds = oldData.map(author => author.aut_id);
        const ids = new URLSearchParams();
        authorIds.map(id => ids.append('aut_ids[]', id));
        try {
            const response = await post(AUTHOR_API({ authorIds }), ids);
            dispatch({
                type: BULK_AUTHOR_ITEMS_DELETE_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: BULK_AUTHOR_ITEMS_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function addAuthor(data) {
    return async dispatch => {
        dispatch({ type: AUTHOR_ADDING });

        try {
            const response = await post(AUTHOR_API(), data);
            dispatch({
                type: AUTHOR_ADD_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ADD_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function checkForExistingAuthor(search, searchField, id, validation) {
    return async dispatch => {
        dispatch({ type: CHECKING_EXISTING_AUTHOR });

        try {
            const response = await get(AUTHORS_SEARCH_API({ query: search }));

            if (
                response.total > 0 &&
                response.data.filter(author => author.aut_id !== id && author[searchField] === search).length > 0
            ) {
                dispatch({
                    type: EXISTING_AUTHOR_FOUND,
                    payload: {
                        [searchField]: {
                            error: true,
                            errorText: validation[searchField],
                        },
                    },
                });
                return Promise.resolve();
            } else {
                dispatch({
                    type: EXISTING_AUTHOR_NOT_FOUND,
                    payload: {
                        [searchField]: {
                            error: false,
                            errorText: null,
                        },
                    },
                });
                return Promise.resolve();
            }
        } catch (e) {
            dispatch({
                type: CHECKING_EXISTING_AUTHOR_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}