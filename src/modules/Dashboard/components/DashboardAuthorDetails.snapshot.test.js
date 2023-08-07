import React from 'react';
import { DashboardAuthorDetails, styles } from './DashboardAuthorDetails';
import { currentAuthor, authorDetails } from 'mock/data';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<DashboardAuthorDetails {...props} />);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const { container } = setup({
            title: currentAuthor.uqresearcher.aut_title || '',
            givenName: currentAuthor.uqresearcher.aut_fname || '',
            familyName: currentAuthor.uqresearcher.aut_lname || '',
            orgUnits: authorDetails.uqresearcher.org_units,
            positions: authorDetails.uqresearcher.positions,
        });
        expect(container).toMatchSnapshot();
    });

    it('should have a style generator', () => {
        const theme = {
            palette: {
                white: {
                    main: '#fff',
                },
            },
        };

        expect(styles(theme)).toEqual({
            authorDetails: {
                color: '#fff',
            },
        });
    });
    /*
    it('identifies Casual position status', () => {
        const wrapper = setup();
        const instance = wrapper.instance();
        expect(instance.areAllCasualPositions(['Assistant Casual Staff'])).toBe(true);
    });*/
});
