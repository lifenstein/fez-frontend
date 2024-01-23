import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as viewRecordActions from './viewControlledVocab';
import * as mockData from 'mock/data';

describe('View controlled vocabulary actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadControlledVocabList action', () => {
        it('dispatches expected actions when loading top level controlled vocabularies from API successfully', async () => {
            mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, { data: { ...mockData.vocabList } });

            const expectedActions = [actions.VIEW_VOCAB_LOADING, actions.VIEW_VOCAB_LOADED];
            try {
                await mockActionsStore.dispatch(viewRecordActions.loadControlledVocabList());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
        it('dispatches expected actions when loading top level controlled vocabularies from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_VOCAB_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_VOCAB_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadControlledVocabList());
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
    });
});