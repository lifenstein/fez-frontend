import SearchRecords from './SearchRecords';
import {routes} from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        publicationsList: [],
        loadingSearch: false,
        ...testProps
    };
    return getElement(SearchRecords, props, isShallow);
}

describe('SearchRecords page', () => {

    it('should render placeholders', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while loading search results', () => {
        const wrapper = setup({loadingSearch: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while loading publications while filtering', () => {
        const wrapper = setup({publicationsList: [1, 2, 2]});
        wrapper.setProps({loadingSearch: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render no results', () => {
        const wrapper = setup({
            publicationsList: [],
            searchQuery: {
                title: 'this is test'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show available filters or selected filters if publicationsListFacets returned (even if there are no results)', () => {
        const wrapper = setup({
            publicationsListFacets: {
                'Some facet': 1,
                'Another facet': 2
            },
            searchQuery: {
                title: 'this is test'
            },
            publicationsList: []
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show available filters or selected filters if activeFacets OA selected (even if there are no results)', () => {
        const wrapper = setup({
            searchQuery: {
                title: 'this is test',
                activeFacets: {
                    showOpenAccessOnly: true
                }
            },
            publicationsList: []
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show available filters or selected filters if activeFacets filter selected (even if there are no results)', () => {
        const wrapper = setup({
            searchQuery: {
                title: 'this is test',
                activeFacets: {
                    filters: {
                        'Display type': 179
                    }
                }
            },
            publicationsList: []
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show available filters or selected filters if activeFacets range selected (even if there are no results)', () => {
        const wrapper = setup({
            searchQuery: {
                title: 'this is test',
                activeFacets: {
                    ranges: {
                        'Year published': {
                            from: 2015,
                            to: 2018
                        }
                    }
                },
            },
            publicationsList: []
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('gets publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testAction}});

        wrapper.instance().componentWillReceiveProps({
            history: {action: 'POP'},
            location: {pathname: routes.pathConfig.records.search, state: {page: 2}}
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(2);
    });

    it('gets publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testAction}});
        wrapper.instance().componentWillReceiveProps({history: {action: 'POP'}, location: {pathname: routes.pathConfig.records.search, state: null}});
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(1);
    });

    it('doesn\'t retrieve data from history if user navigates to next page', () => {
        const testAction = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testAction}});

        wrapper.instance().componentWillReceiveProps({history: {action: 'PUSH'}, location: {pathname: routes.pathConfig.records.search}});
        expect(testAction).not.toHaveBeenCalled();
    });

    it('should call updateSearch() method if query search parameters with searchQueryParams key found', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            location: {
                search: '?searchQueryParams=something%2Dinteresting'
            },
            actions: {
                searchEspacePublications: testAction
            }
        });

        wrapper.instance().componentDidMount();
        expect(testAction).toHaveBeenCalled();
    });

    it('should correctly parse search query string from location search (default filters + title', () => {
        const wrapper = setup({});

        const result = wrapper.instance().parseSearchQueryStringFromUrl('page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Btitle%5D=sometestdata');

        expect(result).toEqual({
            page: '1',
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'sometestdata'
            }
        });
    });

    it('should correctly parse search query string from location search (default filters + publication type facet + title', () => {
        const wrapper = setup({});

        const result = wrapper.instance().parseSearchQueryStringFromUrl('page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5BDisplay+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data');

        expect(result).toEqual({
            page: '1',
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'some test data'
            },
            activeFacets: {
                filters: {
                    'Display type': '130'
                },
                ranges: {},
                showOpenAccessOnly: false
            }
        });
    });

    it('should correctly parse search query string from location search (changed filters + publication type + open access)', () => {
        const wrapper = setup({});

        const result = wrapper.instance().parseSearchQueryStringFromUrl('page=2&pageSize=50&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5BDisplay+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=true&searchQueryParams%5Btitle%5D=some+test+data');

        expect(result).toEqual({
            page: '2',
            pageSize: 50,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'some test data'
            },
            activeFacets: {
                filters: {
                    'Display type': '130'
                },
                ranges: {},
                showOpenAccessOnly: true
            }
        });
    });
});
