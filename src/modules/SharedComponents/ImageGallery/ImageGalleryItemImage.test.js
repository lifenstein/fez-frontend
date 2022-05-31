import React from 'react';
import { render, AllTheProviders, fireEvent } from 'test-utils';

import ImageGalleryItemImage from './ImageGalleryItemImage';
import { collectionSearchResultsImages } from 'mock/data';
import config from 'config/imageGalleryConfig';
import * as utils from './Utils';

const setup = (props = {}) => {
    const testProps = {
        item: { rek_pid: 0 },
        ...props,
    };
    return render(
        <AllTheProviders>
            <ImageGalleryItemImage {...testProps} />
        </AllTheProviders>,
    );
};

describe('Image Gallery Item Image', () => {
    beforeEach(() => {
        config.thumbnailImage.defaultImageName = 'image_unavailable.svg';
    });

    it('should make call when image is restricted', () => {
        const setRestricted = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        setup({ item, setRestricted });

        expect(setRestricted).toHaveBeenCalledWith(true);
    });

    it('should make call when image contains an advisory statement', () => {
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setAdvisory });

        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should make call when image is restricted and contains an advisory statement', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory });

        expect(setRestricted).toHaveBeenCalledWith(true);
        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should NOT make call when image is restricted and contains an advisory statement when admin logged in', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory, security: { isAdmin: true } });

        expect(setRestricted).not.toHaveBeenCalled();
        expect(setAdvisory).not.toHaveBeenCalled();
    });

    it('should NOT make a "restricted" call when image is restricted and contains an advisory statement when author logged in', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory, security: { isAdmin: false, isAuthor: true } });

        expect(setRestricted).not.toHaveBeenCalled();
        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should render a placeholder image when security access is denied', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[4] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[4].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });
    it('should render a gallery image when security access is denied but admin user', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[4], security: { isAdmin: true } });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[4].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).not.toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });

    it('should render a placeholder image when no thumb to show and make a call to the image unavailable function', () => {
        const setUnavailable = jest.fn();
        const testItem = collectionSearchResultsImages.data[0];
        testItem.fez_datastream_info = null;
        const { getByTestId } = setup({ item: testItem, setUnavailable });

        expect(
            getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`),
        ).toBeInTheDocument();
        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`)).toHaveAttribute(
            'src',
            config.thumbnailImage.defaultImageName,
        );
        expect(setUnavailable).toHaveBeenCalledWith(true);
    });
    it('should render a placeholder image when thumb image fails to load and make a call to the image unavailable function', () => {
        const setUnavailable = jest.fn();
        const testItem = collectionSearchResultsImages.data[2];
        const mockGetUrl = jest.spyOn(utils, 'getUrl').mockImplementationOnce(() => 'broken-image-url.jpg');
        const { getByTestId } = setup({ item: testItem, setUnavailable });

        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[2].rek_pid}`);

        expect(mockGetUrl).toHaveBeenCalled();
        expect(galleryElement).toBeInTheDocument();

        expect(galleryElement).toHaveAttribute('src', 'broken-image-url.jpg');

        // cause the image to fire the onError event (won't happen naturally)
        fireEvent.error(galleryElement);

        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(galleryElement).toHaveAttribute('src', config.thumbnailImage.defaultImageName);

        expect(setUnavailable).toHaveBeenCalledWith(true);
    });
    it('should render a gallery image', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[5] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[5].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).not.toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });
});
