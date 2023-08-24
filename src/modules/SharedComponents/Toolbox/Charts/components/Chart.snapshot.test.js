import React from 'react';
import Chart from './Chart';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        chartOptions: {},
        ...testProps,
    };
    return rtlRender(<Chart {...props} />);
}

describe('Chart component', () => {
    it('should mount empty chart component', () => {
        const { container } = setup({
            chartOptions: {
                title: {
                    text: null,
                },
                chart: {
                    type: 'column',
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: -45,
                        y: 18,
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Title',
                    },
                    stackLabels: {
                        enabled: true,
                    },
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: -30,
                    y: -10,
                    floating: true,
                    shadow: false,
                },
                tooltip: {},
                plotOptions: {
                    column: {
                        stacking: 'normal',
                    },
                },
                series: [
                    { name: 'Journal Article', data: [] },
                    { name: 'Conference Paper', data: [] },
                    { name: 'Book Chapter', data: [] },
                    { name: 'Book', data: [] },
                    { name: 'Other', data: [] },
                ],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should set printMedia property', () => {
        const test = jest.fn();
        window.matchMedia = test;
        setup();
        expect(test).toBeCalled();
    });

    it('componentDidMount', () => {
        const addListenerFn = jest.fn();
        const printMediaMock = { addListener: addListenerFn, removeListener: jest.fn() };
        window.matchMedia = jest.fn(() => printMediaMock);
        setup();
        expect(addListenerFn).toBeCalled();
    });

    it('componentDidUpdate', () => {
        const { rerender, container } = setup();
        rerender(<Chart chartOptions={{ title: { text: 'test' } }} />);
        expect(container).toMatchSnapshot();
    });

    it('componentWillUnmount', () => {
        const removeListenerFn = jest.fn();
        const printMediaMock = { addListener: jest.fn(), removeListener: removeListenerFn };
        window.matchMedia = jest.fn(() => printMediaMock);
        const { unmount } = setup();
        unmount();
        expect(removeListenerFn).toBeCalled();
    });
    /*
    it('reflowChart', () => {
        const wrapper = setup();
        const test = jest.fn();
        wrapper.instance().chart = {
            reflow: test,
        };
        wrapper.instance().reflowChart();
        expect(test).toBeCalled();
    });*/
});
