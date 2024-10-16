import { ScaleOfSignificanceTemplate } from '../ScaleOfSignificanceTemplate';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {
            id: 0,
            value: {},
            author: {
                rek_author: '',
            },
        },
        ...testProps,
    };
    return getElement(ScaleOfSignificanceTemplate, props, args);
}

describe('ScaleOfSignificanceTemplate component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with author name', () => {
        const wrapper = setup({
            item: {
                id: 0,
                value: {},
                author: {
                    rek_author: 'author',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
