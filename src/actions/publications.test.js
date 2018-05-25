jest.mock('./exportPublications');

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publicationsActions from './publications';
import * as mockData from 'mock/data';
import {exportPublications} from './exportPublications'
import {exportFormatToExtension} from '../config/general';

beforeEach(() => {
    exportPublications.mockClear();
});

describe('Publications actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('searchLatestPublications()', () => {

        it('dispatches expected actions on successful load', async () => {
            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}).apiUrl)
                .reply(200, {});

            const expectedActions = [
                actions.LATEST_PUBLICATIONS_LOADING,
                actions.LATEST_PUBLICATIONS_LOADED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.LATEST_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.LATEST_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.LATEST_PUBLICATIONS_LOADING,
                actions.LATEST_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchAuthorPublications()', () => {

        it('dispatches expected actions on successful search', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest).apiUrl)
                .reply(200, {});

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_LOADING,
                actions.AUTHOR_PUBLICATIONS_LOADED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.AUTHOR_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_LOADING,
                actions.AUTHOR_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchTrendingPublications()', () => {

        it('dispatches expected actions on successful request', async () => {
            mockApi
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API().apiUrl)
                .reply(200, mockData.trendingPublications);

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@scopus`,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@thomson`,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@altmetric`,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.TRENDING_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                actions.TRENDING_PUBLICATIONS_FAILED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api return 0 publications', async () => {
            mockApi
                .onAny()
                .reply(200, {total: 0, data: [], filters: []});

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                actions.TRENDING_PUBLICATIONS_LOADED
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('exportAuthorPublications()', () => {
        it('calls exportPublications with expected params', async () => {

            const exportPublicationsFormat = Object.keys(exportFormatToExtension)[0];
            const testRequest = {
                exportPublicationsFormat,
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
                activeFacets: {filters: {}, ranges: {}}
            };

            publicationsActions.exportAuthorPublications(testRequest);
            expect(exportPublications).toHaveBeenCalledWith(repositories.routes.CURRENT_USER_RECORDS_API(testRequest, 'export'));
        });
    });
});
