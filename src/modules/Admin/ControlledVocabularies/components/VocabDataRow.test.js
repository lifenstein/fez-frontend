import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import Immutable from 'immutable';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';

const vocabDataRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <VocabDataRow {...testProps} />
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the row', async () => {
        const { getByText } = setup({ row: vocabDataRow });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        const { getByTestId } = setup({ row: vocabDataRow });
        const button = getByTestId('expand-row-453669');
        expect(button).toBeInTheDocument();
    });
});
