import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { CCL_4_0_SLUG_TEXT_MAP, getCreativeCommonsUrl } from 'config/general';

const CreativeCommonsLicenceTemplate = ({ data: { by, nd, nc, sa }, fieldId }) => {
    // Note: the order of conditions is important; don't change.
    const conditions = [];
    by && conditions.push('by');
    nc && conditions.push('nc');
    nd && conditions.push('nd');
    sa && conditions.push('sa');
    const licence = conditions.join('-');

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="body2" component="div" id={`${fieldId}-value`} data-testid={`${fieldId}-value`}>
                    <ExternalLink
                        href={getCreativeCommonsUrl('4.0')(licence)}
                        id={`${fieldId}-lookup`}
                        data-testid={`${fieldId}-lookup`}
                    >
                        {CCL_4_0_SLUG_TEXT_MAP[licence]}
                    </ExternalLink>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ExternalLink
                    href={getCreativeCommonsUrl('4.0')(licence)}
                    id={`${fieldId}-icon`}
                    data-testid={`${fieldId}-icon`}
                    openInNewIcon={false}
                >
                    <div className={`fez-icon license cc-${licence}`} />
                </ExternalLink>
            </Grid>
        </Grid>
    );
};

CreativeCommonsLicenceTemplate.propTypes = {
    data: PropTypes.object,
    fieldId: PropTypes.string,
};

export default CreativeCommonsLicenceTemplate;
