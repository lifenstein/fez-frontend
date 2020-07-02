import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const OverrideSecurity = ({ label, input, disabled, overrideSecurityId }) => (
    <FormControlLabel
        control={
            <Checkbox
                inputProps={{
                    'data-testid': `${overrideSecurityId}-input`,
                    id: `${overrideSecurityId}-input`,
                }}
                disabled={disabled}
                onChange={input.onChange}
                checked={input.value === 0}
            />
        }
        {...{ label }}
    />
);

OverrideSecurity.propTypes = {
    label: PropTypes.string,
    input: PropTypes.object,
    disabled: PropTypes.bool,
    overrideSecurityId: PropTypes.string,
};

export default React.memo(OverrideSecurity);
