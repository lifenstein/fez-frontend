import React from 'react';
import FixRecord from './FixRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { act, render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

function setup(testProps, renderMethod = render) {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        pristine: true,
        submitAsSideEffect: false,
        submitting: false,
        invalid: false,
        submitSucceeded: false,
        recordToFix: testProps.recordToFix,
        loadingRecordToFix: testProps.loadingRecordToFix || false,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || { aut_id: 410 },

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues:
            testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToFix || mockRecordToFix),
                author: Immutable.Map(testProps.author || { aut_id: 410 }),
            }),
        actions: testProps.actions || { clearFixRecord: jest.fn() },
        history: testProps.history || { go: jest.fn() },
        match: testProps.match || {},

        publicationToFixFileUploadingError: testProps.publicationToFixFileUploadingError || false,
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <FixRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component FixRecord', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let mockOnChange;
    beforeEach(() => {
        ReduxFormMock.Field.mockImplementation(
            ({ name, title, required, disable, label, floatingLabelText, onChange }) => {
                mockOnChange = onChange;

                return (
                    <field
                        is="mock"
                        name={name}
                        title={title}
                        required={required}
                        disabled={disable}
                        label={label || floatingLabelText}
                    />
                );
            },
        );
    });

    afterEach(() => {
        mockOnChange = undefined;
    });
    it('should render loader when author is loading', () => {
        const { container } = setup({ recordToFix: mockRecordToFix, accountAuthorLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const { container } = setup({ recordToFix: mockRecordToFix, loadingRecordToFix: true });
        expect(container).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        setup({ author: { aut_id: 1001 }, recordToFix: mockRecordToFix, history: { go: testMethod } });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const { container } = setup({ recordToFix: mockRecordToFix });
        expect(container).toMatchSnapshot();

        // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
    });

    it('should render fix record form', () => {
        const { container } = setup({ recordToFix: mockRecordToFix });
        act(() => mockOnChange(undefined, 'fix'));
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(5);
    });

    it('should render unclaim form', () => {
        const { container } = setup({ recordToFix: mockRecordToFix });
        act(() => mockOnChange(undefined, 'unclaim'));
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should display confirmation box after successful submission', () => {
        const { getByText } = setup({ recordToFix: mockRecordToFix, dirty: true, submitSucceeded: true });
        expect(getByText(/Fix work request has been submitted successfully/i)).toBeInTheDocument();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        setup({
            loadingRecordToFix: false,
            recordToFix: null,
            actions: { loadRecordToFix: actionFunction, clearFixRecord: jest.fn() },
            match: { params: { pid: 'UQ:1001' } },
        });

        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should display confirmation box after successful unclaim and go to my works', () => {
        const { getByText, getByTestId, rerender } = setup({
            recordToFix: mockRecordToFix,
        });
        act(() => mockOnChange(undefined, 'unclaim'));

        const pushMock = jest.fn();
        setup(
            {
                recordToFix: mockRecordToFix,
                submitSucceeded: true,
                history: { push: pushMock },
            },
            rerender,
        );

        expect(getByText(/You have unclaimed this work successfully/i)).toBeInTheDocument();
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(pushMock).toBeCalledWith('/records/mine');
    });

    it('should display confirmation box after successful unclaim and go back to previous page', () => {
        const { getByTestId, rerender } = setup({
            recordToFix: mockRecordToFix,
        });
        act(() => mockOnChange(undefined, 'unclaim'));

        const goBackMock = jest.fn();
        setup(
            {
                recordToFix: mockRecordToFix,
                submitSucceeded: true,
                history: { goBack: goBackMock },
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(goBackMock).toBeCalled();
    });

    it('should display confirmation box after successful submission and go to dashboard', () => {
        const { getByTestId, rerender } = setup({
            recordToFix: mockRecordToFix,
        });
        act(() => mockOnChange(undefined, 'fix'));

        const pushMock = jest.fn();
        setup(
            {
                recordToFix: mockRecordToFix,
                submitSucceeded: true,
                history: { push: pushMock },
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(pushMock).toBeCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const { getByText, rerender } = setup({
            recordToFix: mockRecordToFix,
        });
        act(() => mockOnChange(undefined, 'fix'));

        setup(
            {
                recordToFix: mockRecordToFix,
                submitSucceeded: true,
                publicationToFixFileUploadingError: true,
            },
            rerender,
        );

        expect(getByText(/File upload failed/i)).toBeInTheDocument();
    });

    /*
    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ recordToFix: mockRecordToFix, actions: { clearFixRecord: actionFunction } });
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false });
        const testFN = jest.fn();
        const event = { preventDefault: testFN };
        wrapper.instance()._handleDefaultSubmit(event);
        expect(testFN).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false });
        wrapper.instance()._handleDefaultSubmit();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('componentWillUnmount()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            actions: { clearFixRecord: testFN },
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false,
        });
        wrapper.instance().componentWillUnmount();
        expect(testFN).toHaveBeenCalled();
    });*/
});
