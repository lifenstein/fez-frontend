jest.dontMock('./JournalArticleForm');

import JournalArticleForm from './JournalArticleForm';
import {NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION} from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(JournalArticleForm, props, isShallow);
}

describe('JournalArticleForm renders ', () => {
    it.skip('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(11);
    });

    it.skip('component with 5 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it.skip('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('component with 4 input fields for NTRO', () => {
        const wrapper = setup({isNtro: true});
        expect(wrapper.find('NtroFields').dive().find('Field').length).toEqual(4);
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const wrapper = setup({isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION});
        expect(wrapper.find('NtroFields').dive().find('Field').length).toEqual(5);
    });
});
