import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid';

export const VocabDataRow = ({ row }) => {
    return (
        <Grid
            container
            key={row.cvo_id}
            data-testid={`row-${row.cvo_id}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.cvo_id}>
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={{ float: 'left', width: '24px' }}>
                            <IconButton
                                sx={{ paddingTop: '5px' }}
                                aria-label="expand row"
                                size="small"
                                id={`expand-row-${row.cvo_id}`}
                                data-analyticsid={`expand-row-${row.cvo_id}`}
                                data-testid={`expand-row-${row.cvo_id}`}
                            >
                                {<KeyboardArrowDownIcon />}
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item md={8} sm={6} xs={6}>
                        <Box>{row.cvo_title}</Box>
                    </Grid>
                    <Grid item md={1} xs={2} sm={2}>
                        <Box>{/* row.cvo_image_filename*/}</Box>
                    </Grid>
                    <Grid item md={1} xs={2} sm={2}>
                        <Box>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item md={1} xs={1} sm={1}>
                        {''}
                    </Grid>
                </Grid>
            </React.Fragment>
        </Grid>
    );
};
VocabDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    adminUser: PropTypes.bool,
    labels: PropTypes.object,
};
export default VocabDataRow;
