import React from 'react';

import PropTypes from 'prop-types';
import VocabDataRow from './VocabDataRow';
import Grid from '@mui/material/Grid';

export const VocabTable = ({ records, labels, conf, autoCollapse, adminUser }) => {
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-primary-header">
                <Grid item md={1}>
                    {''}
                </Grid>
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {labels.id}
                </Grid>
                <Grid item md={6}>
                    {labels.title}
                </Grid>
                <Grid item md={1}>
                    {labels.order}
                </Grid>
                <Grid item md={1}>
                    {labels.license}
                </Grid>
                <Grid item md={1}>
                    {labels.external_id}
                </Grid>
                <Grid item md={1}>
                    {labels.actions}
                </Grid>
            </Grid>
            {/* Data Row */}
            {console.log('records=', records)}
            <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-primary-body">
                {records.map(row => (
                    <VocabDataRow
                        key={row.cvo_id}
                        conf={conf}
                        row={row}
                        adminUser={adminUser}
                        labels={labels}
                        autoCollapse={autoCollapse}
                    />
                ))}
            </Grid>
        </Grid>
    );
};
VocabTable.propTypes = {
    records: PropTypes.array,
    location: PropTypes.object,
    labels: PropTypes.object,
    conf: PropTypes.object,
    autoCollapse: PropTypes.bool,
    adminUser: PropTypes.bool,
};
export default VocabTable;
