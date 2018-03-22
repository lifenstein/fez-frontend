import academicStatsReducer from './academic';
import * as actions from 'actions/actionTypes';

export const initialState = {
    loadingPublicationsByYear: true,
    publicationsByYear: null,
    publicationTypesCount: null,
    loadingPublicationsStats: true,
    publicationsStats: null
};

describe('academicStatsReducer', () => {
    describe('updates store correctly when', () => {
        it('current autor stats loading', () => {
            const state = academicStatsReducer(initialState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADING});
            expect(state).toEqual(initialState);
            expect(state.loadingPublicationsByYear).toBeTruthy();
        });

        it('current author publications by year loaded', () => {
            const oldState = {...initialState, loadingPublicationsByYear: true};
            const payload = [1, 2, 3, 4, 5];
            const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED, payload: payload});
            expect(state.loadingPublicationsByYear).toBeFalsy();
            expect(state.publicationsByYear.length).toBe(5);
            expect(state).toEqual(expect.objectContaining({publicationsByYear: payload}));
        });

        it('current author stats failed', () => {
            const oldState = {...initialState, loadingPublicationsByYear: true, loadingPublicationsStats: true};
            const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_FAILED});
            expect(state.loadingPublicationsByYear).toBeFalsy();
            expect(state.loadingPublicationsStats).toBeFalsy();
            expect(state.publicationsByYear).toBe(null);
            expect(state.publicationsStats).toBe(null);
        });

        it('current author publication types count loaded', () => {
            const oldState = {...initialState};
            const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED, payload: {popular: 10, mostViewed: 5}});
            expect(state).toEqual(expect.objectContaining({publicationTypesCount: {popular: 10, mostViewed: 5}}));
        });

        it('current author stats loaded', () => {
            const oldState = {...initialState, loadingPublicationsStats: true};
            const payload = [1, 2, 3, 4, 5];
            const state = academicStatsReducer(oldState, {type: actions.ACADEMIC_PUBLICATIONS_STATS_LOADED, payload: payload});
            expect(state.loadingPublicationsStats).toBeFalsy();
            expect(state.publicationsStats.length).toBe(5);
            expect(state).toEqual(expect.objectContaining({publicationsStats: payload}));
        });
    });

    it('does not find handler', () => {
        const state = academicStatsReducer(undefined, {type: 'INVALID_ACTION_TYPE'});
        expect(state).toEqual(initialState);
    });
});