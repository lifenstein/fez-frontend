import React from 'react';
import { rtlRender, fireEvent, act, createMatchMedia } from 'test-utils';
import FileName from './FileName';

import { journalArticle } from 'mock/data/testing/records';
import { CURRENT_LICENCES } from 'config/general';

const id = 'test-file-name';

function setup(testProps = {}, render = rtlRender) {
    const { previewFileName, ...rest } = testProps;
    const props = {
        id: id,
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: 'application/pdf',
        mediaUrl:
            (!!testProps.fileName && `https://espace.library.uq.edu.au/view/UQ:676287/${testProps.fileName}`) || '',
        previewMediaUrl:
            (!!previewFileName && `https://espace.library.uq.edu.au/view/UQ:676287/${previewFileName}`) || '',
        onFileSelect: jest.fn(),
        allowDownload: false,
        ...rest,
    };
    return render(<FileName {...props} />);
}

describe('File Name Component ', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render component and display file name only', () => {
        const { getByText, queryByTestId } = setup({ downloadLicence: {} });
        expect(queryByTestId('test-file-name')).toBeInTheDocument();
        expect(getByText('UQ676287_OA.pdf')).toBeInTheDocument();
    });

    it('should display file name link', () => {
        const { getByText, queryByTestId, container } = setup({
            allowDownload: true,
            fileName: 'test.pdf',
            previewFileName: 'preview_test.jpg',
            checksums: { media: '111' },
        });
        expect(getByText('test.pdf')).toBeInTheDocument();
        expect(queryByTestId(`${id}-download-button`)).toBe(null);
        expect(container.querySelector('a[title="test.pdf"][target="_blank"]')).toBeInTheDocument();
    });

    it('should display image preview', () => {
        const { getByText, queryByTestId } = setup({
            allowDownload: true,
            fileName: 'test.jpg',
            mimeType: 'image/jpeg',
            previewFileName: 'preview_test.jpg',
            checksums: { media: '111' },
        });
        expect(getByText('test.jpg')).toBeInTheDocument();
        expect(queryByTestId(`${id}-download-button`)).toBe(null);
        expect(queryByTestId(`${id}-preview`)).toBeInTheDocument();
    });

    it("shouldn't display image preview when a restrictive license is being used", () => {
        const { getByText, queryByTestId } = setup({
            allowDownload: true,
            fileName: 'test.jpg',
            mimeType: 'image/jpeg',
            previewFileName: 'preview_test.jpg',
            checksums: { media: '111' },
            downloadLicence: CURRENT_LICENCES[0],
        });
        expect(getByText('test.jpg')).toBeInTheDocument();
        expect(queryByTestId(`${id}-download-button`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-preview`)).toBe(null);
    });

    it('should render audio player', () => {
        const { getByText, queryByTestId, container } = setup({
            allowDownload: true,
            mimeType: 'audio/mp3',
            fileName: 'test.mp3',
            checksums: { media: '111' },
        });
        expect(getByText('test.mp3')).toBeInTheDocument();
        expect(queryByTestId(`${id}-download-button`)).toBe(null);
        expect(queryByTestId('audioPlayer')).toBeInTheDocument();
        expect(container.querySelector('button[aria-label^="Click to play audio file"]')).toBeInTheDocument();
    });

    it("shouldn't render audio player when a restrictive license is being used", () => {
        const { getByText, getByTestId, queryByTestId, container } = setup({
            allowDownload: true,
            mimeType: 'audio/mp3',
            fileName: 'test.mp3',
            checksums: { media: '111' },
            downloadLicence: CURRENT_LICENCES[0],
        });
        expect(getByText('test.mp3')).toBeInTheDocument();
        expect(getByTestId(`${id}-download-button`)).toBeInTheDocument();
        expect(queryByTestId('audioPlayer')).toBe(null);
        expect(container.querySelector('button[aria-label^="Click to play audio file"]')).toBe(null);
    });

    it('should run onFileSelect function on click', () => {
        const testFn = jest.fn();
        const { getByText } = setup({
            allowDownload: true,
            mimeType: 'image/jpeg',
            fileName: 'test.jpg',
            previewFileName: 'preview_test.jpg',
            onFileSelect: testFn,
        });
        act(() => {
            fireEvent.click(getByText('test.jpg'));
        });
        expect(testFn).toHaveBeenCalledTimes(1);
    });

    it('should run onFileSelect function on key press', () => {
        const testFn = jest.fn();
        const { getByText } = setup({
            allowDownload: true,
            fileName: 'test.mp4',
            previewFileName: 'preview_test.jpg',
            mimeType: 'video/mp4',
            onFileSelect: testFn,
        });
        act(() => {
            fireEvent.keyPress(getByText('test.mp4'), { key: 'Enter', code: 13, charCode: 13 });
        });
        expect(testFn).toHaveBeenCalledTimes(1);
    });

    it('should be able to trigger and cancel licence confirmation', () => {
        const { getByTestId } = setup({
            allowDownload: true,
            fileName: 'test.zip',
            mimeType: 'application/zip',
            downloadLicence: CURRENT_LICENCES[0],
        });
        act(() => {
            fireEvent.click(getByTestId(`${id}-download-button`));
        });
        expect(getByTestId('confirm-cancel-action')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-cancel-action'));
        });
    });

    it('should be able to trigger and accept licence confirmation', () => {
        global.open = jest.fn();
        const { getByTestId } = setup({
            allowDownload: true,
            fileName: 'test.zip',
            mimeType: 'application/zip',
            downloadLicence: CURRENT_LICENCES[0],
        });
        act(() => {
            fireEvent.click(getByTestId(`${id}-download-button`));
        });
        expect(getByTestId('confirm-action')).toBeInTheDocument();
        fireEvent.click(getByTestId('confirm-action'));

        expect(global.open).toHaveBeenCalledWith('http://localhost/view/UQ:676287/test.zip', '_blank');
    });
});
