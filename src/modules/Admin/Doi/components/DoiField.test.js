import { shallow } from 'enzyme';
import { DoiField } from './DoiField';

import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
const record = publicationTypeListResearchReport.data[0];

jest.mock('modules/ViewRecord/components/AdditionalInformation');
jest.mock('react-html-parser');

import { formatPublicationDate } from 'modules/ViewRecord/components/AdditionalInformation';
import ReactHtmlParser from 'react-html-parser';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        classes: {},
        ...testProps,
    };

    return getElement(DoiField, props, args);
};

describe('DoiField', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toBe('');
    });

    it('should render unknown field value in readable format', () => {
        const wrapper = setup({ field: 'abc123', label: 'Unknown', data: 'testing' });
        expect(wrapper.find('[data-testid="abc123"]').text()).toBe('"testing"');
    });

    it('should render known fields', () => {
        const testFn = ({ data, displayTypeLookup, field, label, test }) => {
            const wrapper = setup({
                data: data || record[field],
                displayTypeLookup,
                field,
                label: label || field,
            });
            test(wrapper);
        };

        const knownFields = [
            // Author
            {
                field: 'fez_record_search_key_author',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-author-0"]').text()).toBe(
                        record.fez_record_search_key_author[0].rek_author,
                    );
                },
            },
            // HTML
            {
                field: 'rek_description',
                test: () => {
                    expect(ReactHtmlParser).toHaveBeenCalledWith(record.rek_description);
                },
            },
            // Date
            {
                field: 'rek_date',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date, undefined);
                },
            },
            // Edition
            {
                field: 'fez_record_search_key_edition',
                data: {
                    rek_edition: '1',
                },
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-edition"]').text()).toBe('1');
                },
            },
            // Example of list keys
            {
                field: 'fez_record_search_key_isbn',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-isbn"]').text()).toBe(
                        record.fez_record_search_key_isbn[0].rek_isbn,
                    );
                },
            },
            // Example of single entry keys
            {
                field: 'fez_record_search_key_publisher',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-publisher"]').text()).toBe(
                        record.fez_record_search_key_publisher.rek_publisher,
                    );
                },
            },
            // Example of generic entry with label
            {
                field: 'fez_record_search_key_conference_location',
                data: {
                    rek_conference_location: 'test location',
                },
                label: 'Conference location',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-conference-location"]').text()).toBe('test location');
                    expect(wrapper.find('[data-testid="rek-conference-location-label"]').text()).toBe(
                        'Conference location',
                    );
                },
            },

            /* Special Cases */

            // Author with ORCID
            {
                field: 'fez_record_search_key_author',
                data: [
                    {
                        rek_author_id: 10101,
                        rek_author: 'First Last',
                        aut_orcid_id: '101010-1010101',
                    },
                ],
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-author-0"]').text()).toBe('First Last');
                    expect(wrapper.find('[data-testid="rek-author-0-orcid-link"]').props().href).toBe(
                        'https://orcid.org/101010-1010101',
                    );
                },
            },
            // Empty contributors list
            {
                field: 'fez_record_search_key_contributor',
                data: [],
                test: wrapper => {
                    expect(toJson(wrapper)).toBe('');
                },
            },
            // Empty list item
            {
                field: 'fez_record_search_key_isbn',
                data: [],
                test: wrapper => {
                    expect(toJson(wrapper)).toBe('');
                },
            },
            // Date with custom format
            {
                field: 'rek_date',
                displayTypeLookup: 'YYYY',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date, 'YYYY');
                },
            },
            // Depositor name
            {
                field: 'rek_author-name',
                data: 'Test Depositor',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-author-name"]').text()).toBe('Test Depositor');
                },
            },
            // Depositor email
            {
                field: 'rek_author-email',
                data: 'example@uq.edu.au',
                test: wrapper => {
                    const entry = wrapper.find('[data-testid="rek-author-email"]');
                    expect(entry.text()).toBe('example@uq.edu.au');
                    const renderedEmail = shallow(entry.props().children);
                    expect(renderedEmail.props().href).toBe('mailto:example@uq.edu.au');
                },
            },
            // Series with ": no"
            {
                field: 'fez_record_search_key_series',
                data: {
                    rek_series: 'Book series: no.1',
                },
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-series"]').text()).toBe('Book series');
                },
            },
            // Series with ";"
            {
                field: 'fez_record_search_key_series',
                data: {
                    rek_series: 'Book series 1; Book series 2',
                },
                test: wrapper => {
                    expect(wrapper.find('[data-testid="rek-series"]').text()).toBe('Book series 1');
                },
            },
            // Non-numeric Edition
            {
                field: 'fez_record_search_key_edition',
                data: {
                    rek_edition: '15th',
                },
                test: wrapper => {
                    expect(toJson(wrapper.find('[data-testid="rek-edition"]'))).toBe(null);
                },
            },
        ];

        knownFields.map(testFn);
    });
});
