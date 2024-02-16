import React from 'react';

import { render, WithReduxStore, WithRouter } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabDataRow from './ChildVocabDataRow';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';

const row = mockData.childVocabList['453669'].data[0].controlled_vocab;

function setup(testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <ChildVocabDataRow {...testProps} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table row', async () => {
        const { getByTestId } = setup({ row: row });
        expect(getByTestId('child-row-id-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-desc-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-order-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-image-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-eid-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-action-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-link-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-link-453670').href).toMatch(/\/\?id=453670$/);
    });
});
