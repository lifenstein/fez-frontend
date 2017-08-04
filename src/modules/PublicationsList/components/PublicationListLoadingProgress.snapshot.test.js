jest.dontMock('./SearchDashboard');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationListLoadingProgress from './PublicationListLoadingProgress';

function setup({loadingPublicationSources, mobile}) {
    const props = {loadingPublicationSources, mobile};
    return shallow(<PublicationListLoadingProgress {...props} />);
}

describe('Search Dashboard test', () => {
    it('Render the search dashboard with expected data)', () => {
        const loadingPublicationSources = {
            loadingPublicationSources: {
                crossref: true,
                crossrefCount: 0,
                pubmed: true,
                pubmedCount: 0,
                scopus: true,
                scopusCount: 0,
                totalSearchedCount: 4,
                totalSourcesCount: 4,
                wos: true,
                wosCount: 5
            }
        };
        const mobile = true;

        const wrapper = setup(loadingPublicationSources, mobile);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the search dashboard with random data, one still loading)', () => {
        const loadingPublicationSources = {
            loadingPublicationSources: {
                crossref: false,
                crossrefCount: 0,
                pubmed: true,
                pubmedCount: 12,
                scopus: true,
                scopusCount: 4,
                totalSearchedCount: 3,
                totalSourcesCount: 4,
                wos: true,
                wosCount: 5
            }
        };
        const mobile = true;

        const wrapper = setup(loadingPublicationSources, mobile);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the search dashboard with random data, all still loading)', () => {
        const loadingPublicationSources = {
            loadingPublicationSources: {
                crossref: false,
                crossrefCount: 0,
                pubmed: false,
                pubmedCount: 12,
                scopus: false,
                scopusCount: 4,
                totalSearchedCount: 0,
                totalSourcesCount: 4,
                wos: false,
                wosCount: 5
            }
        };
        const mobile = true;

        const wrapper = setup(loadingPublicationSources, mobile);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
