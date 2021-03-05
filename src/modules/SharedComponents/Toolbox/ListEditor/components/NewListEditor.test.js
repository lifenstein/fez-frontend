import React from 'react';
import NewListEditor from './NewListEditor';
import { render, AllTheProviders, fireEvent, waitFor } from 'test-utils';

const setup = (testProps = {}) => {
    const props = {
        onChange: jest.fn(),
        locale: {
            form: {
                locale: {
                    addButtonLabel: 'Add',
                    editButtonLabel: 'Edit',
                },
            },
        },
        ...testProps,
    };
    return render(
        <AllTheProviders>
            <NewListEditor {...props} />
        </AllTheProviders>,
    );
};

describe('NewListEditor component', () => {
    it('should render the items in the list', () => {
        const { getByTestId } = setup({
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        expect(getByTestId('keywords-list')).toBeInTheDocument();
        expect(getByTestId('keywords-list-row-0')).toBeInTheDocument();
        expect(getByTestId('keywords-list-row-0')).toHaveTextContent('one');
        expect(getByTestId('keywords-list-row-1')).toBeInTheDocument();
        expect(getByTestId('keywords-list-row-1')).toHaveTextContent('two');
        expect(getByTestId('keywords-list-row-2')).toBeInTheDocument();
        expect(getByTestId('keywords-list-row-2')).toHaveTextContent('three');
    });

    it('should disable the form after max number of items has been added to the list', () => {
        const { getByTestId } = setup({
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            maxCount: 4,
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        expect(getByTestId('keywords-form-add')).toBeInTheDocument();
        expect(getByTestId('keywords-input')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('keywords-input'), { target: { value: 'four' } });
        fireEvent.click(getByTestId('keywords-add'));

        expect(getByTestId('keywords-list-row-3')).toBeInTheDocument();
        expect(getByTestId('keywords-list-row-3')).toHaveTextContent('four');

        expect(getByTestId('keywords-input')).toHaveAttribute('disabled');
    });

    it('should not add duplicate item', () => {
        const { getByTestId, queryByTestId } = setup({
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.change(getByTestId('keywords-input'), { target: { value: 'three' } });
        fireEvent.click(getByTestId('keywords-add'));

        expect(queryByTestId('keywords-list-row-3')).not.toBeInTheDocument();
    });

    it('should update the item', () => {
        const { getByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.click(getByTestId('keywords-list-row-2-edit'));
        fireEvent.change(getByTestId('keywords-input'), { target: { value: 'four' } });
        fireEvent.click(getByTestId('keywords-update'));

        expect(getByTestId('keywords-list-row-2')).toHaveTextContent('four');
    });

    it('should not update the item if duplicate item is being added', () => {
        const { getByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.click(getByTestId('keywords-list-row-2-edit'));
        fireEvent.change(getByTestId('keywords-input'), { target: { value: 'two' } });
        fireEvent.click(getByTestId('keywords-update'));

        expect(getByTestId('keywords-list-row-2')).toHaveTextContent('three');
    });

    it('should change order of the items', () => {
        const { getByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.click(getByTestId('keywords-list-row-1-move-up'));

        expect(getByTestId('keywords-list-row-0')).toHaveTextContent('two');
        expect(getByTestId('keywords-list-row-1')).toHaveTextContent('one');

        fireEvent.click(getByTestId('keywords-list-row-1-move-down'));

        expect(getByTestId('keywords-list-row-1')).toHaveTextContent('three');
        expect(getByTestId('keywords-list-row-2')).toHaveTextContent('one');
    });

    it('should delete an item from the list', () => {
        const { getByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.click(getByTestId('keywords-list-row-1-delete')); // two
        waitFor(() => getByTestId('confirm-action'));
        fireEvent.click(getByTestId('confirm-action'));

        expect(getByTestId('keywords-list-row-1')).toHaveTextContent('three');
    });

    it('should delete all items from the list', () => {
        const { getByTestId, queryByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
        });

        fireEvent.click(getByTestId('delete-all-keywords'));
        waitFor(() => getByTestId('confirm-action'));
        fireEvent.click(getByTestId('confirm-action'));

        expect(queryByTestId('keywords-list-row-0')).not.toBeInTheDocument();
    });

    it('should render scrolling list', () => {
        const { getByTestId } = setup({
            canEdit: true,
            list: ['one', 'two', 'three'],
            listEditorId: 'keywords',
            searchKey: { value: 'rek_keywords', order: 'rek_keywords_order' },
            scrollList: true,
            scrollListHeight: 55,
        });

        expect(getByTestId('keywords-scroll-list')).toBeInTheDocument();
    });
});
