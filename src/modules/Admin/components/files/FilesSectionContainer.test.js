import { FilesSectionContainer, mapStateToProps } from './FilesSectionContainer';
import Immutable from 'immutable';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        onDeleteAttachedFile: jest.fn(),
        openAccessStatusId: 0,
        ...testProps,
    };

    return getElement(FilesSectionContainer, props, args);
}

describe('FilesSectionContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            disabled: undefined,
            formValues: Immutable.Map({}),
            openAccessStatusId: NaN,
        });
    });
});
