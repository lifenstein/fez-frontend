import { renderPolicyItems, SecurityCard } from './SecurityCard';

function setup(testProps, isShallow = true) {
    const props = {
        disabled: false,
        selectedPolicyKey: 1,
        fieldID: 'test1',
        entity: {
            type: 'test2',
        },
        text: {
            description: 'test3',
            prompt: 'test4'
        },
        ...testProps
    };

    return getElement(SecurityCard, props, isShallow);
}

describe('SecurityCard component', () => {

    const policyArray = [
        { name: 'test1Name', id: 'test1ID', value: 1, label: 'test1Label' },
        { name: 'test2Name', id: 'test2ID', value: 2, label: 'test2Label' },
        { name: 'test3Name', id: 'test3ID', value: 3, label: 'test3Label' },
    ];
    it('should render policy items as expected', () => {
        const test1 = renderPolicyItems();
        expect(test1).toMatchSnapshot();

        const test2 = renderPolicyItems(policyArray);
        expect(test2).toMatchSnapshot();
    });

    it('should render properly', () => {
        const wrapper1 = setup({});
        expect(toJson(wrapper1)).toMatchSnapshot();

        const wrapper2 = setup({ selectedPolicyKey: undefined });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

});