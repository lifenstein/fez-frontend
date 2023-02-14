import React from 'react';
import { render } from 'test-utils';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import createMatchMedia from './createMatchMedia';

// eslint-disable-next-line react/prop-types
const GetMQ = ({ breakpoint }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down(breakpoint));
    return matches && <>Breakpoint matches</>;
};
function setup(breakpoint = 'sm') {
    return render(
        <div>
            <GetMQ breakpoint={breakpoint} />
        </div>,
    );
}
describe('createMatchMedia', () => {
    it('should show text', () => {
        window.matchMedia = createMatchMedia(599);
        const { getByText } = setup();
        expect(window.matchMedia('(min-width: 500px)').matches).toBe(true);
        expect(window.matchMedia('(min-width: 600px)').matches).toBe(false);
        expect(getByText('Breakpoint matches')).toBeInTheDocument();
    });
    it('should not show text', () => {
        window.matchMedia = createMatchMedia(600);
        const { queryByText } = setup();
        expect(window.matchMedia('(min-width: 500px)').matches).toBe(true);
        expect(window.matchMedia('(min-width: 700px)').matches).toBe(false);
        expect(queryByText('Breakpoint matches')).not.toBeInTheDocument();
    });
});
