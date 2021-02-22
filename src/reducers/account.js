import * as actions from 'actions/actionTypes';

export const initialState = {
    account: null,
    author: null,
    authorDetails: null,
    accountLoading: false,
    accountAuthorLoading: false,
    accountAuthorDetailsLoading: true,
    isSessionExpired: null,
};

export const initSavingState = {
    accountAuthorSaving: false,
    accountAuthorError: null,
};

const handlers = {
    [actions.CURRENT_ACCOUNT_LOADING]: () => ({
        ...initialState,
        ...initSavingState,
    }),

    [actions.CURRENT_ACCOUNT_LOADED]: (state, action) => ({
        ...state,
        accountLoading: false,
        account: action.payload,
    }),

    [actions.CURRENT_ACCOUNT_ANONYMOUS]: () => ({
        ...initialState,
        ...initSavingState,
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false,
    }),

    [actions.CURRENT_AUTHOR_FAILED]: state => ({
        ...state,
        author: null,
        accountAuthorLoading: false,
    }),

    [actions.CURRENT_AUTHOR_LOADED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorLoading: false,
    }),

    [actions.CURRENT_AUTHOR_LOADING]: state => ({
        ...state,
        author: null,
        accountAuthorLoading: true,
    }),

    [actions.CURRENT_AUTHOR_SAVING]: state => ({
        ...state,
        accountAuthorSaving: true,
        accountAuthorError: null,
    }),

    [actions.CURRENT_AUTHOR_SAVE_FAILED]: (state, action) => ({
        ...state,
        accountAuthorSaving: false,
        accountAuthorError: action.payload,
    }),

    [actions.CURRENT_AUTHOR_SAVE_RESET]: state => ({
        ...state,
        ...initSavingState,
    }),

    [actions.CURRENT_AUTHOR_SAVED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorSaving: false,
        accountAuthorError: null,
    }),

    [actions.CURRENT_AUTHOR_DETAILS_FAILED]: state => ({
        ...state,
        authorDetails: null,
        accountAuthorDetailsLoading: false,
    }),

    [actions.CURRENT_AUTHOR_DETAILS_LOADED]: (state, action) => ({
        ...state,
        authorDetails: action.payload,
        accountAuthorDetailsLoading: false,
    }),

    [actions.CURRENT_AUTHOR_DETAILS_LOADING]: state => ({
        ...state,
        authorDetails: null,
        accountAuthorDetailsLoading: true,
    }),

    [actions.CURRENT_ACCOUNT_SESSION_EXPIRED]: state => ({
        ...state,
        isSessionExpired: true,
    }),

    [actions.CURRENT_ACCOUNT_SESSION_VALID]: state => ({
        ...state,
        isSessionExpired: false,
    }),

    [actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG]: state => ({
        ...state,
        isSessionExpired: null,
    }),
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
