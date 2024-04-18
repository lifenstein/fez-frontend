import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardTodayData: null,
    adminDashboardTodayLoading: false,
    adminDashboardTodaySuccess: null,
    adminDashboardTodayError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_TODAY_LOADING]: () => ({
        ...initialState,
        adminDashboardTodayLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_TODAY_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardTodayLoading: false,
        adminDashboardTodaySuccess: true,
        adminDashboardTodayData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_TODAY_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardTodayLoading: false,
        adminDashboardTodayError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_TODAY_CLEAR]: () => ({ ...initialState }),

    [actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING]: () => ({
        ...initialState,
        adminDashboardQuickLinksLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksSuccess: true,
        adminDashboardQuickLinksData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
