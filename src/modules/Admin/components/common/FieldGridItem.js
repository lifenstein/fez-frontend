import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import { fieldConfig } from 'config/admin';
import { NTRO_SUBTYPES } from 'config/general';
import { useRecordContext } from 'context';

export const FieldGridItem = ({ field, group, disabled }) => {
    const { record } = useRecordContext();
    if (!fieldConfig.default[field]) {
        console.warn('No field config found for', field);
        return '';
    }

    const componentProps = {
        ...fieldConfig.default[field].componentProps,
        ...(((fieldConfig.override[record.rek_display_type] || {})[field] || (() => {}))({
            isNtro: NTRO_SUBTYPES.includes(record.rek_subtype),
        }) || {}),
    };

    return (
        <Grid item xs={12} md={12 / group.length}>
            <Field disabled={disabled} component={fieldConfig.default[field].component} {...componentProps} />
        </Grid>
    );
};

FieldGridItem.propTypes = {
    field: PropTypes.string,
    group: PropTypes.array,
    disabled: PropTypes.bool,
    childrenItems: PropTypes.array,
};
