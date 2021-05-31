import React from 'react';
import ManageAuthors from './index';
import { act, render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent } from 'test-utils';
import * as ManageAuthorsActions from 'actions/manageAuthors';
import * as AppActions from 'actions/app';
import * as repository from 'repositories';

jest.mock('./helpers', () => ({
    checkForExisting: jest.fn(),
}));
import { checkForExisting } from './helpers';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <ManageAuthors {...testProps} />
        </WithReduxStore>,
    );
};

describe('ManageAuthors', () => {
    beforeEach(() => {
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render empty list', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByText } = setup();

        await act(() => waitForElementToBeRemoved(() => getByText('Loading authors')));

        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render default view', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, search: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2006-03-31T00:00:00Z',
                        aut_description: null,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_email: 'punp@ramsayhealth.com.au',
                        aut_external_id: '0000065773',
                        aut_fname: 'PaulKang',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2011,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Pun',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: null,
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: '0030916',
                        aut_org_student_id: null,
                        aut_org_username: 'uqppun',
                        aut_people_australia_id: null,
                        aut_position: null,
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Dr',
                        aut_twitter_username: null,
                        aut_update_date: '2020-01-19T19:29:55Z',
                    },
                ],
                total: 1,
            });
        const loadAuthorListFn = jest.spyOn(ManageAuthorsActions, 'loadAuthorList');

        const { getByText, getByTestId } = setup({});

        await act(() => waitForElementToBeRemoved(() => getByText('Loading authors')));

        expect(loadAuthorListFn).toBeCalled();

        await act(() => waitFor(() => expect(getByTestId('authors-list')).toBeInTheDocument()));

        // Expect table column titles
        expect(getByText('ID')).toBeInTheDocument();
        expect(getByText('Display name')).toBeInTheDocument();
        expect(getByText('UQ username')).toBeInTheDocument();
    });

    it('should render error message', async () => {
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        mockApi
            .onGet(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, query: '' }).apiUrl)
            .replyOnce(500);

        const { getByText } = setup({});
        await act(() => waitFor(() => expect(getByText('No records to display')).toBeInTheDocument()));
        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));
    });

    it('should change call an api with updated page size', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2014,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2015,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2016,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2017,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2018,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2019,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2020,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2021,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2022,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2023,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2024,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2025,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },

                    {
                        aut_id: 2026,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2027,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2028,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2029,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2030,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            })
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 50, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2014,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2015,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2016,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_student_username: 'uqppun',
                    },
                    {
                        aut_id: 2017,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2018,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2019,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2020,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2021,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2022,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2023,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2024,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2025,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },

                    {
                        aut_id: 2026,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2027,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2028,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2029,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2030,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2032,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2032,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2033,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            });

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-19')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByText('20 rows'));
        });

        act(() => {
            fireEvent.click(getByText('50'));
        });

        await act(() => waitFor(() => getByTestId('authors-list-row-22')));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-22')).toBeInTheDocument();
    });

    it('should bulk delete authors', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost('fez-authors/delete-list')
            .replyOnce(200, {
                data: {
                    '2011': 'Author deleted',
                    '2012': 'Author deleted',
                    '2013': 'Author deleted',
                },
            });

        const { getByText, getByTestId, queryByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-2')).toBeInTheDocument();

        fireEvent.click(getByTestId('select-author-0'));
        fireEvent.click(getByTestId('select-author-1'));
        fireEvent.click(getByTestId('select-author-2'));
        fireEvent.click(getByTestId('authors-delete-selected-authors'));
        fireEvent.click(getByTestId('confirm-action'));

        await act(() =>
            waitFor(() => {
                expect(queryByTestId('authors-list-row-0')).not.toBeInTheDocument();
                expect(queryByTestId('authors-list-row-2')).not.toBeInTheDocument();
            }),
        );
    });

    it('should fail to bulk delete all authors', async () => {
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost(`${repository.routes.AUTHOR_API().apiUrl}/delete-list`)
            .replyOnce(500);

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-2')).toBeInTheDocument();

        fireEvent.click(getByTestId('select-author-0'));
        fireEvent.click(getByTestId('select-author-1'));
        fireEvent.click(getByTestId('select-author-2'));
        fireEvent.click(getByTestId('authors-delete-selected-authors'));
        fireEvent.click(getByTestId('confirm-action'));

        await act(() =>
            waitFor(() => {
                expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
                expect(getByTestId('authors-list-row-2')).toBeInTheDocument();
                expect(showAppAlert).toHaveBeenCalled();
            }),
        );
    });

    it('should exit from editing author mode', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2006-03-31T00:00:00Z',
                        aut_description: null,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_email: 'punp@ramsayhealth.com.au',
                        aut_external_id: '0000065773',
                        aut_fname: 'PaulKang',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2011,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Pun',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: null,
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: '0030916',
                        aut_org_student_id: null,
                        aut_org_username: 'uqppun',
                        aut_people_australia_id: null,
                        aut_position: null,
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Dr',
                        aut_twitter_username: null,
                        aut_update_date: '2020-01-19T19:29:55Z',
                    },
                ],
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .reply(200, { data: [], total: 0 });
        const { getByTestId, getByText, queryByTestId, queryByText } = setup();

        await act(() => waitForElementToBeRemoved(() => getByText('Loading authors')));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();

        fireEvent.click(getByTestId('authors-list-row-0'));
        fireEvent.keyDown(getByTestId('author-edit-row'), { key: 'Escape' });

        expect(queryByTestId('author-edit-row')).not.toBeInTheDocument();
        expect(queryByText('Name information')).not.toBeInTheDocument();
    });

    it('should validate inputs and render added info after adding', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onPost(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(200, { data: { aut_id: 1, aut_display_name: 'Test, Name' } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-342' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        await waitFor(() => getByTestId('aut-name-overridden'));

        fireEvent.click(getByTestId('aut-name-overridden'));
        fireEvent.click(getByTestId('aut-is-scopus-id-authenticated'));
        fireEvent.click(getByTestId('authors-add-this-author-save'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(500);
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');
        const { getByTestId, queryByTestId } = setup({});

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.click(getByTestId('authors-add-this-author-save'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(queryByTestId('aut-display-name-0')).not.toBeInTheDocument();
    });

    it('should validate inputs and render updated info after editing', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: null,
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Desai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-2222',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: '',
                        aut_people_australia_id: null,
                        aut_position: 'Sr. Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                ],
                total: 1,
            })
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(200, { data: { aut_id: 1, aut_display_name: 'Test, Name', aut_org_username: 'uqtname' } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('value', 'Desai');
        expect(getByTestId('aut-position-input')).toHaveAttribute('value', 'Sr. Web Developer');
        expect(getByTestId('aut-title-input')).toHaveAttribute('value', 'Mr.');
        expect(getByTestId('aut-description-input')).toHaveTextContent('Added position. Updated name');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: '' } });
        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: '' } });

        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-update-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-543' } });
        fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '1234564' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtname' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));
        fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        fireEvent.click(getByTestId('authors-update-this-author-save'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqtname');
    });

    it('should validate inputs and render same info after unsuccessful editing operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: null,
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: 'asdflakjssss',
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Desai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-2222',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: '',
                        aut_people_australia_id: null,
                        aut_position: 'Sr. Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                ],
                total: 1,
            })
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(500);

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('value', 'Desai');
        expect(getByTestId('aut-position-input')).toHaveAttribute('value', 'Sr. Web Developer');
        expect(getByTestId('aut-title-input')).toHaveAttribute('value', 'Mr.');
        expect(getByTestId('aut-description-input')).toHaveTextContent('Added position. Updated name');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: '' } });
        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: '' } });
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-update-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-543' } });
        });
        fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '1234564' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtname' } });
        fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        fireEvent.click(getByTestId('authors-update-this-author-save'));

        await waitFor(() => getByTestId('authors-list-row-0'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', '');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', '');
    });

    it('should delete an author item', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: null,
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003831,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Desai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-2222',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: '',
                        aut_people_australia_id: null,
                        aut_position: 'Sr. Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Vishal, Desai',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-3333',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: 'uqvdesai',
                        aut_people_australia_id: null,
                        aut_position: 'Sr Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                ],
                total: 2,
            })
            .onDelete(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(200, { data: { aut_id: 2000003831 } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');
        const { getByTestId, getByText } = setup();

        await act(() => waitForElementToBeRemoved(() => getByText('Loading authors')));

        const listItem0 = getByTestId('authors-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('authors-list-row-1');
        expect(listItem1).toBeInTheDocument();

        fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        fireEvent.click(getByTestId('confirm-action'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Vishal, Desai');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqvdesai');
    });

    it('should render same list after unsuccessful delete operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Test, Name',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003831,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Desai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-2222',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: 'uqtname',
                        aut_people_australia_id: null,
                        aut_position: 'Sr. Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Vishal, Desai',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-3333',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: 'uqvdesai',
                        aut_people_australia_id: null,
                        aut_position: 'Sr Web Developer',
                        aut_publons_id: null,
                        aut_ref_num: null,
                        aut_researcher_id: null,
                        aut_review_orcid_scopus_id_integration: null,
                        aut_rid_last_updated: null,
                        aut_rid_password: null,
                        aut_scopus_id: null,
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                ],
                total: 2,
            })
            .onDelete(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(422, { data: 'Error' })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const listItem0 = getByTestId('authors-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('authors-list-row-1');
        expect(listItem1).toBeInTheDocument();

        fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        fireEvent.click(getByTestId('confirm-action'));

        await act(() => waitFor(() => expect(showAppAlert).toHaveBeenCalled()));

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqtname');
        expect(getByTestId('aut-display-name-1')).toHaveAttribute('value', 'Vishal, Desai');
        expect(getByTestId('aut-org-username-1')).toHaveAttribute('value', 'uqvdesai');
    });

    it('should copy author id to clipboard', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    aut_created_date: '2006-03-31T00:00:00Z',
                    aut_description: null,
                    aut_display_name: 'Pun, PaulKang K.',
                    aut_email: 'punp@ramsayhealth.com.au',
                    aut_external_id: '0000065773',
                    aut_fname: 'PaulKang',
                    aut_google_scholar_id: null,
                    aut_homepage_link: null,
                    aut_id: 2011,
                    aut_is_orcid_sync_enabled: null,
                    aut_is_scopus_id_authenticated: 0,
                    aut_lname: 'Pun',
                    aut_mname: null,
                    aut_mypub_url: null,
                    aut_orcid_bio: null,
                    aut_orcid_id: null,
                    aut_orcid_works_last_modified: null,
                    aut_orcid_works_last_sync: null,
                    aut_org_staff_id: '0030916',
                    aut_org_student_id: null,
                    aut_org_username: 'uqppun',
                    aut_people_australia_id: null,
                    aut_position: null,
                    aut_publons_id: null,
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_review_orcid_scopus_id_integration: null,
                    aut_rid_last_updated: null,
                    aut_rid_password: null,
                    aut_scopus_id: null,
                    aut_student_username: null,
                    aut_title: 'Dr',
                    aut_twitter_username: null,
                    aut_update_date: '2020-01-19T19:29:55Z',
                },
            ],
            total: 1,
        });
        Object.assign(navigator, {
            clipboard: {
                writeText: () => {
                    return Promise.resolve();
                },
            },
        });
        jest.spyOn(navigator.clipboard, 'writeText');

        const { getByTestId, getByText } = setup();

        await act(() => waitForElementToBeRemoved(() => getByText('Loading authors')));

        fireEvent.click(getByTestId('aut-id-0-copy-text'));

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(2011);

        waitFor(() => getByTestId('copied-text-snackbar'));
    });
});
