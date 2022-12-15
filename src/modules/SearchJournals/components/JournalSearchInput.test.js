import React from 'react';
import { fireEvent, render, WithReduxStore, act } from 'test-utils';
import { JournalSearchInput } from './JournalSearchInput';
import locale from 'locale/components';

const setup = state => {
    return render(
        <WithReduxStore>
            <JournalSearchInput {...{ onReset: jest.fn(), ...state }} />
        </WithReduxStore>,
    );
};

describe('JournalSearchInput', () => {
    it('should render', () => {
        const { getByText, queryByTestId } = setup();
        expect(getByText(locale.components.searchJournals.journalSearchInput.titlePrefix)).toBeInTheDocument();
        expect(getByText(locale.components.searchJournals.journalSearchInput.title)).toBeInTheDocument();
        expect(queryByTestId('journal-search-keywords-input')).toBeInTheDocument();
        expect(queryByTestId('clear-journal-search-keywords')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow to enter short text', () => {
        const input = 'a';
        const { queryByTestId } = setup();
        act(() => {
            fireEvent.change(queryByTestId('journal-search-keywords-input'), { target: { value: input } });
        });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        expect(queryByTestId('clear-journal-search-keywords')).toHaveAttribute('aria-disabled', 'false');
    });

    it('should allow to enter text', () => {
        jest.useFakeTimers();
        global.dataLayer = { push: jest.fn() };
        const input = 'abc';
        const { queryByTestId } = setup();
        act(() => {
            fireEvent.change(queryByTestId('journal-search-keywords-input'), { target: { value: input } });
        });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        jest.runAllTimers();
        expect(global.dataLayer.push).toHaveBeenCalledTimes(1);
    });

    it('should allow to clear text', () => {
        const input = 'abc';
        const { queryByTestId } = setup({ initialValue: input });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        fireEvent.click(queryByTestId('clear-journal-search-keywords'));
        act(() => {
            expect(queryByTestId('journal-search-keywords-input').value).toBe('');
        });
    });
});
