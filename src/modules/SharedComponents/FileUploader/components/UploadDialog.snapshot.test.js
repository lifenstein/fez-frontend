jest.dontMock('./UploadDialog');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import UploadDialog from './UploadDialog';
import {DIALOG_GETTING_STARTED_PAGE, DIALOG_STEPPER_PAGE} from '../actions';

function setup(page = '') {
    const acceptedFiles = [
        {
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        },
        {
            name: 's12345678_test_file_boot.iso',
            size: 241172480,
        }
    ];

    const props = {
        acceptedFiles: acceptedFiles,
        form: 'testForm',
        uploadError: '',
        isDialogOpen: true,
        isUploadCompleted: false,
        cancelUpload: jest.fn(),
        closeDialog: jest.fn(),
        decreaseStep: jest.fn(),
        increaseStep: jest.fn(),
        openDialog: jest.fn(),
        resetSteps: jest.fn(),
        showSnackbar: jest.fn(),
        uploadFile: jest.fn(),
        stepperIndex: 0,
        page,
        uploadProgress: {}
    };
    return shallow(<UploadDialog {...props} />);
}

describe('File upload dialog snapshots tests', () => {
    it('renders default file upload dialog component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });

    it('renders getting started component', () => {
        const app = setup(DIALOG_GETTING_STARTED_PAGE);
        expect(toJson(app)).toMatchSnapshot();
    });

    it('renders stepper component', () => {
        const app = setup(DIALOG_STEPPER_PAGE);
        expect(toJson(app)).toMatchSnapshot();
    });
});
