import React from 'react';

import { render, WithReduxStore, WithRouter } from 'test-utils';
import { createMemoryHistory } from 'history';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import Immutable from 'immutable';
import { waitFor } from '@testing-library/dom';
import * as repositories from 'repositories';

const parentRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <ChildVocabTable {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table', async () => {
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
            .reply(200, mockData.childVocabList[453669]);

        const initState = {};
        const { getByText, getByTestId } = setup({ parentRow: parentRow }, initState);
        // ztodo: when loading one children, it updated the other expanded children.
        expect(getByText('Description')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByTestId('child-vocab-title-453670')).toBeInTheDocument();
        });
    });
});
