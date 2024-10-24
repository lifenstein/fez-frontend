import ScaleOfSignificanceListEditor from '../ScaleOfSignificanceListEditor';
import { List } from 'immutable';

function setup(testProps = {}, args = {}) {
    const props = {
        className: 'testClass',
        searchKey: { value: 'value', order: 'order' },
        isValid: jest.fn(),
        disabled: false,
        onChange: jest.fn(),
        formComponent: jest.fn(),
        inputField: jest.fn(),
        hideReorder: false,
        distinctOnly: false,
        errorText: '',
        scrollList: testProps.scrollList || false,
        scrollListHeight: testProps.scrollListHeight || 250,
        listEditorId: 'test-list-editor',
        ...testProps,
    };
    return getElement(ScaleOfSignificanceListEditor, props, args);
}

describe('ScaleOfSignificanceListEditor tests', () => {
    it('should render full component with a defined className', () => {
        const wrapper = setup({ className: 'requiredField' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render full component as disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render an item to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should render an object item to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem({ id: 'test', value: 'test value' });
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should update an object item in the list', () => {
        const wrapper = setup();
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem({ id: 'test', value: 'test value' });
        expect(wrapper.state().itemList.length).toEqual(1);
        wrapper.instance().loadEditForm(0);
        wrapper.instance().saveChangeToItem({ id: 'test', value: 'testing value' });
        expect(wrapper.state().itemList.length).toEqual(1);
        expect(wrapper.state().itemList).toEqual([{ id: 'test', value: 'testing value' }]);
    });

    it('should render items not more than maxCount', () => {
        const wrapper = setup({ maxCount: 1 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
        wrapper.instance().saveChangeToItem('two');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should not add null item to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem(undefined);
        wrapper.instance().saveChangeToItem(null);
        wrapper.instance().saveChangeToItem('');
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('should delete an item from the list', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteItem('one', 0);
        expect(wrapper.state().itemList.length).toEqual(2);
    });

    it('should delete all items from a list', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteAllItems();
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('should move up an item', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveUpList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('one');
        wrapper.instance().moveUpList('one', 0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should move down an item', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveDownList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('three');
        wrapper.instance().moveDownList('three', 2);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render items individually when comma separated not more than maxCount', () => {
        const wrapper = setup({ maxCount: 5 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should render input value as itemList', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: [
                    {
                        rek_value: 'test 1',
                    },
                    {
                        rek_value: 'test 2',
                    },
                ],
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render input value as itemList for List', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: new List([
                    {
                        rek_value: 'test 1',
                    },
                    {
                        rek_value: 'test 2',
                    },
                ]),
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should process incomplete props without error', () => {
        const wrapper = setup({
            input: {
                name: 'test',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should add item and set state', () => {
        const wrapper = setup({
            maxCount: 5,
            distinctOnly: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().saveChangeToItem({
            key: 'test',
            value: 'test',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not call transformOutput if onChange prop method is not defined', () => {
        const wrapper = setup({
            onChange: null,
        });
        const test = jest.spyOn(wrapper.instance(), 'transformOutput');
        wrapper.setProps({});
        expect(test).not.toBeCalled();
    });

    it('should add an object item and set state', () => {
        const wrapper = setup({
            maxCount: 5,
            distinctOnly: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().saveChangeToItem({
            id: 'test',
            value: 'test',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render a list of many items in a scrollable HTML div', () => {
        const wrapper = setup({ scrollList: true, scrollListHeight: 250 });
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.setState({ itemList: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] });
        expect(wrapper.state().itemList.length).toEqual(10);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render a list of many items inline', () => {
        const wrapper2 = setup({ scrollList: false, scrollListHeight: 250 });
        wrapper2.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper2.state().itemList.length).toEqual(3);
        wrapper2.setState({
            itemList: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        });
        expect(wrapper2.state().itemList.length).toEqual(10);
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('Should render a list of many items inline', () => {
        const wrapper2 = setup({ scrollList: false });
        wrapper2.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper2.state().itemList.length).toEqual(3);
        wrapper2.setState({
            itemList: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        });
        expect(wrapper2.state().itemList.length).toEqual(10);
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('should update an item with selected index', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        wrapper.setState({ itemIndexSelectedToEdit: 1 });
        wrapper.instance().saveChangeToItem('four');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update an entry with selected index', () => {
        const wrapper = setup();
        wrapper.setState({
            itemList: [
                { key: 'test 1', value: { thing: 'something' } },
                { key: 'test 2', value: { thing: 'something else' } },
            ],
        });
        wrapper.setState({ itemIndexSelectedToEdit: 1 });
        wrapper.instance().saveChangeToItem('new 1');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set item to edit index', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        wrapper.instance().loadEditForm(1);
        expect(wrapper.state().itemIndexSelectedToEdit).toEqual(1);
    });

    it('should not add duplicate item with the same "key" in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { key: '1234-1234', value: { ulrichs: {} } },
                { key: '1234-1111', value: { ulrichs: {} } },
            ],
        });

        wrapper.instance().saveChangeToItem({ key: '1234-1234', value: { sherpaRomeo: {}, ulrichs: {} } });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem({ key: '1234-1235', value: { sherpaRomeo: {}, ulrichs: {} } });

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should not add duplicate item with the same "id" in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { id: 1234, value: 'test' },
                { id: 2345, value: 'testing' },
            ],
        });

        wrapper.instance().saveChangeToItem({ id: 1234, value: 'test' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem({ id: 1235, value: 'testing testing' });

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should not add duplicate item with the same text in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: ['test', 'testing'],
        });

        wrapper.instance().saveChangeToItem('test');

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem('testing testing');

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should add edited item with the same "id" but different "value"', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { id: 1234, value: 'test' },
                { id: 2345, value: 'testing' },
            ],
        });

        wrapper.instance().saveChangeToItem({ id: 1234, value: 'test' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().loadEditForm(1);

        wrapper.instance().saveChangeToItem({ id: 2345, value: 'testing testing' });

        expect(wrapper.state().itemList.length).toEqual(2);

        expect(wrapper.state().itemList).toEqual([
            { id: 1234, value: 'test' },
            { id: 2345, value: 'testing testing' },
        ]);
    });

    it('should add edited item with the same "key" but different "value"', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { key: 'http://www.test.com', value: 'test site' },
                { key: 'http://www.testing.com', value: 'testing site' },
            ],
        });

        wrapper.instance().saveChangeToItem({ key: 'http://www.test.com', value: 'test site' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().loadEditForm(0);

        wrapper.instance().saveChangeToItem({ key: 'http://www.test.com', value: 'test link' });

        expect(wrapper.state().itemList.length).toEqual(2);

        expect(wrapper.state().itemList).toEqual([
            { key: 'http://www.test.com', value: 'test link' },
            { key: 'http://www.testing.com', value: 'testing site' },
        ]);
    });
});
