import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import SectionTitle from './SectionTitle';

const PieChartContainer = ({ label, subtext, children }) => {
    return (
        <React.Fragment>
            <SectionTitle textAlign={'center'}>{label}</SectionTitle>
            {subtext && (
                <SectionTitle textAlign={'center'} textTransform="none">
                    {subtext}
                </SectionTitle>
            )}
            <Box>{children}</Box>
        </React.Fragment>
    );
};

PieChartContainer.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    subtext: PropTypes.any,
};

export default React.memo(PieChartContainer);
