import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import { render, fireEvent, act, waitFor, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        list: [],
        handleRowAdd: jest.fn(() => Promise.resolve()),
        handleRowUpdate: jest.fn(() => Promise.resolve()),
        handleRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <MyEditorialAppointmentsList {...props} />
        </WithReduxStore>,
    );
}

describe('MyEditorialAppointmentsList', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for editorial appointments', () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });

        expect(getByTestId('my-editorial-appointments-list-row-0')).toBeInTheDocument();
    });

    it('should validate inputs and render added info after adding', async () => {
        const { getByTestId, getByText } = setup({
            list: [],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-add-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
        });

        const listItem = await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        const { getByTestId, getByText, queryByTestId } = setup({
            list: [],
            handleRowAdd: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
        });

        await waitFor(() => getByText('No records to display'));

        expect(queryByTestId('my-editorial-appointments-list-row-0')).not.toBeInTheDocument();
    });

    it('should validate inputs and render updated info after editing', async () => {
        const { getByTestId, getByLabelText, getByText } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });
        const listItem = getByTestId('my-editorial-appointments-list-row-0');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Guest Editor');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2006');
        expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('2026');

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: '' } });
        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.click(getByLabelText('Clear'));
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-update-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Other'));

        expect(getByTestId('eap-role-name-input')).toBeInTheDocument();
        fireEvent.change(getByTestId('eap-role-name-input'), { target: { value: 'Testing other role' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-save'));
        });

        await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0')).toHaveTextContent('2010');
        expect(getByTestId('eap-role-name-0')).toHaveTextContent('Testing other role');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            ],
            handleRowUpdate: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-save'));
        });

        await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            ],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-cancel'));
        });

        await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should delete my editorial appointment item', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
                {
                    eap_id: 2,
                    eap_journal_name: 'testing',
                    eap_jnl_id: 12345,
                    eap_role_cvo_id: '123457',
                    eap_start_year: '2016',
                    eap_end_year: '2020',
                    eap_role_name: 'Editor',
                },
            ],
        });
        const listItem0 = getByTestId('my-editorial-appointments-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('my-editorial-appointments-list-row-1');
        expect(listItem1).toBeInTheDocument();

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-delete'));

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-delete-save'));
        });

        const listItem = await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Editor');
    });
});
