import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, WithRouter, waitFor, act, userEvent } from 'test-utils';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import * as JournalActions from 'actions/journals';

import { accounts } from 'mock/data/account';
import { journalDoaj } from 'mock/data';
import JournalAdminContainer from './JournalAdminContainer';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

jest.mock('../submitHandler', () => ({
    onSubmit: jest.fn(),
}));
jest.mock('js-cookie', () => jest.fn());

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

function setup(testState = {}) {
    const state = {
        accountReducer: {
            account: {
                account: accounts.uqresearcher,
            },
            author: {
                aut_id: 111,
            },
        },
        ...testState,
    };
    return render(
        <WithRouter>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <JournalAdminContainer />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('JournalAdminContainer component', () => {
    describe('Fullform view', () => {
        beforeAll(() => {
            Cookies.get = jest.fn().mockImplementation(() => 'fullform');
            Cookies.set = jest.fn();
        });

        beforeEach(() => {
            useParams.mockImplementation(() => ({ id: 12 }));
        });

        it('should render default view', async () => {
            const promise = Promise.resolve();
            const state = {
                viewJournalReducer: {
                    journalToView: journalDoaj.data,
                },
            };
            const { getByText } = setup(state);

            expect(getByText('Edit journal - Advanced Nonlinear Studies')).toBeInTheDocument();

            const switcher = document.querySelector('input.MuiSwitch-input');
            expect(switcher).not.toHaveAttribute('checked');
            await act(async () => {
                await promise;
            });
        });

        it('should render loading journal view', () => {
            const state = {
                viewJournalReducer: {
                    loadingJournalToView: true,
                },
            };
            const { getByText } = setup(state);
            expect(getByText('Loading work')).toBeInTheDocument();
        });

        it('should render journal not found view', () => {
            const state = {
                viewJournalReducer: {
                    journalToView: undefined,
                    journalToViewError: { message: 'test', status: 404 },
                },
            };
            const { getByText } = setup(state);
            expect(getByText('Work not found')).toBeInTheDocument();
            expect(getByText('(404 - test)')).toBeInTheDocument();
        });

        it('should render empty div if journal is not loaded', () => {
            const state = {
                viewJournalReducer: {
                    journalToView: undefined,
                },
            };
            useParams.mockImplementation(() => ({ id: undefined }));
            setup(state);
            const div = document.querySelector('.empty');
            expect(div).not.toBeNull();
        });

        it('should render not found message when no journal is provided', async () => {
            const state = {
                viewJournalReducer: {
                    journalToView: null,
                },
            };
            const { getByTestId } = setup(state);
            await waitFor(() => expect(getByTestId('page-title')).toHaveTextContent('Work not found'));
        });

        it('should render not found message journal error is encountered', async () => {
            const state = {
                viewJournalReducer: {
                    journalLoadingError: true,
                },
            };

            const { getByTestId } = setup(state);
            await waitFor(() => expect(getByTestId('page-title')).toHaveTextContent('Work not found'));
        });
    });
    describe('Tabbed view', () => {
        beforeAll(() => {
            Cookies.get = jest.fn().mockImplementation(() => 'tabbed');
            Cookies.set = jest.fn();
        });
        beforeEach(() => {
            useParams.mockImplementation(() => ({ id: 12 }));
        });

        it('should render component with tabbed interface', async () => {
            const promise = Promise.resolve();
            const state = {
                viewJournalReducer: {
                    journalToView: journalDoaj.data,
                },
            };
            const { getByTestId } = setup(state);
            const switcher = document.querySelector('input.MuiSwitch-input');
            expect(switcher).toHaveAttribute('checked');
            expect(getByTestId('admin-tab')).toHaveClass('Mui-selected');

            await act(async () => {
                await promise;
            });
        });
    });

    it('should call action.adminJournalClear() on unload', async () => {
        const adminJournalClearSpy = jest.spyOn(JournalActions, 'adminJournalClear');
        const promise = Promise.resolve();
        const state = {
            viewJournalReducer: {
                journalToView: journalDoaj.data,
            },
        };
        const { getByTestId } = setup(state);

        await userEvent.click(getByTestId('admin-work-cancel-top'));

        await waitFor(() => expect(adminJournalClearSpy).toHaveBeenCalled());

        await act(async () => {
            await promise;
        });
    });
});
