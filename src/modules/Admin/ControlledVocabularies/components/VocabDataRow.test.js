import React from 'react';

import { render, WithReduxStore, fireEvent} from 'test-utils';

import Immutable from 'immutable';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';
import { waitFor } from '@testing-library/dom';

const vocabDataRow = mockData.vocabList.data[0];

const setup = ( testProps = {}, state = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <VocabDataRow {...testProps} />
        </WithReduxStore>
);
};


describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the row', async () => {
        const { getByText } = setup({ row: vocabDataRow });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        const { getByRole } = setup({ row: vocabDataRow });
        const button = getByRole('button', { id: 'expand-row-454025' });
        fireEvent.click(button);
        expect(button).toBeInTheDocument();
    });    
});
