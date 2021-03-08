import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export const ColumnData = ({ columnDataId, data }) => (
    <Typography
        variant="body2"
        {...(!!columnDataId
            ? {
                  'data-testid': columnDataId,
                  id: columnDataId,
              }
            : {})}
    >
        {data}
    </Typography>
);

ColumnData.propTypes = {
    columnDataId: PropTypes.string,
    data: PropTypes.any,
};

export default React.memo(ColumnData);
