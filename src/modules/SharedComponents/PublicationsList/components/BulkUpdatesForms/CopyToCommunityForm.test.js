import React from 'react';
import CopyToCommunityForm from './CopyToCommunityForm';
import { act, render, WithRouter, WithReduxStore, fireEvent, waitFor } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        recordsSelected: {
            'UQ:123456': {
                rek_pid: 'UQ:123456',
                rek_object_type: 2,
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }],
            },
        },
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <CopyToCommunityForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('CopyToCommunityForm', () => {
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

    it('should correctly submit form and display success info for copy to collection form', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-community-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-community-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-community-submit'));
        });

        await waitFor(() => getByTestId('alert-done-copy-to-community'));
        expect(getByTestId('alert-done-copy-to-community')).toBeInTheDocument();
    });

    it('should submit form and display error for copy to community form', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-community-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-community-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-community-submit'));
        });

        await waitFor(() => getByTestId('alert-error-copy-to-community'));
        expect(getByTestId('alert-error-copy-to-community')).toBeInTheDocument();
    });

    it('should correctly submit form and display success info for remove from community', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-community-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-community-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-community-submit'));
        });

        await waitFor(() => getByTestId('alert-done-remove-from-community'));
        expect(getByTestId('alert-done-remove-from-community')).toBeInTheDocument();
    });

    it('should submit form and display error for remove from community', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-community-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-community-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-community-submit'));
        });

        await waitFor(() => getByTestId('alert-error-remove-from-community'));
        expect(getByTestId('alert-error-remove-from-community')).toBeInTheDocument();
    });

    it('should display warning alert to user if work is being removed from all communities', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:123', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        expect(queryByTestId('alert-warning-remove-from-community')).not.toBeInTheDocument();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        expect(getByTestId('alert-warning-remove-from-community')).toBeInTheDocument();
        expect(getByTestId('remove-from-community-submit')).toHaveAttribute('disabled');
    });
});
