jest.dontMock('./BookChapterForm');

import BookChapterForm from './BookChapterForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION } from 'config/general';
import Immutable from 'immutable';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(BookChapterForm, props);
}

describe('BookChapterForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 15 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(15);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('component with 4 input fields for NTRO', () => {
        const wrapper = setup({ isNtro: true });
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(5);
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const wrapper = setup({ isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION });
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(6);
    });

    it('shows an error when end page is less than start page', () => {
        const formValues = {
            fez_record_search_key_start_page: {
                rek_start_page: 768,
            },
            fez_record_search_key_end_page: {
                rek_end_page: 400,
            },
        };
        const testProps = {
            formValues: Immutable.Map(formValues),
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should normalize the issn input value', () => {
        const wrapper = setup();
        expect(wrapper.instance().normalizeIssn('12345678')).toEqual('1234-5678');
        expect(wrapper.instance().normalizeIssn('1234-5678')).toEqual('1234-5678');
        expect(wrapper.instance().normalizeIssn('1234')).toEqual('1234');
    });

    it('should transform the issn output value', () => {
        const wrapper = setup();
        expect(
            wrapper.instance().transformIssn({ value: 'rek_issn', order: 'rek_issn_order' }, { key: '1234-5678' }, 3),
        ).toEqual({ rek_issn: '1234-5678', rek_issn_order: 4 });
    });
});
