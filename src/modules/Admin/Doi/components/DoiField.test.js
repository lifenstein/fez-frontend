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
        const wrapper = setup({ data: 'testing' });
        expect(wrapper.find('pre').text()).toBe('"testing"');
    });

    it('should render known fields', () => {
        const knowns = [
            // Special cases
            {
                key: 'fez_record_search_key_author',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="author-0"]').text()).toBe(
                        record.fez_record_search_key_author[0].rek_author,
                    );
                },
            },
            {
                key: 'rek_title',
                test: () => {
                    expect(ReactHtmlParser).toHaveBeenCalledWith(record.rek_title);
                },
            },
            {
                key: 'rek_date',
                test: () => {
                    expect(formatPublicationDate).toHaveBeenCalledWith(record.rek_date);
                },
            },
            // Example of list keys
            {
                key: 'fez_record_search_key_isbn',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="fez_record_search_key_isbn-value"]').text()).toBe(
                        record.fez_record_search_key_isbn[0].rek_isbn,
                    );
                },
            },
            // Example of single entry keys
            {
                key: 'fez_record_search_key_publisher',
                test: wrapper => {
                    expect(wrapper.find('[data-testid="fez_record_search_key_publisher-value"]').text()).toBe(
                        record.fez_record_search_key_publisher.rek_publisher,
                    );
                },
            },
        ];
        knowns.map(known => {
            const field = known.key;
            const wrapper = setup({ field, data: record[field], heading: field });
            known.test(wrapper);
        });

        // Custom entries

        const doiWrapper = setup({ field: 'doi', data: 'test', heading: 'DOI (Existing)' });
        expect(doiWrapper.find('[data-testid="doi-value"]').text()).toBe('test');

        const nameWrapper = setup({ field: 'depositorName', data: 'Test Depositor', heading: 'Depositor name' });
        expect(nameWrapper.find('[data-testid="depositorName-value"]').text()).toBe('Test Depositor');

        const emailWrapper = setup({ field: 'depositorEmail', data: 'example@uq.edu.au', heading: 'Depositor email' });
        const entry = emailWrapper.find('[data-testid="depositorEmail-value"]');
        expect(entry.text()).toBe('example@uq.edu.au');
        const renderedEmail = shallow(entry.props().children);
        expect(renderedEmail.props().href).toBe('mailto:example@uq.edu.au');
    });
});
