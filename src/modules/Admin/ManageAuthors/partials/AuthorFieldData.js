import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { makeStyles } from '@material-ui/styles';

import { useEditableContext } from 'context';

const useStyles = makeStyles(() => ({
    root: {
        '&::before': {
            borderBottom: '1px dashed rgba(0, 0, 0, 0.13)',
        },
    },
    underline: {},
}));

export const AuthorFieldData = ({ authorFieldDataId, data, title, ...props }) => {
    const classes = useStyles();
    const { editable } = useEditableContext();
    return (
        <TextField
            {...props}
            textFieldId={authorFieldDataId}
            label={title}
            fullWidth
            InputProps={{
                style: {
                    fontSize: 14,
                    fontWeight: 400,
                },
                ...(!editable
                    ? {
                          readOnly: true,
                          classes: {
                              root: classes.root,
                              underline: classes.underline,
                          },
                          ...props.InputProps,
                      }
                    : {
                          ...props.InputProps,
                      }),
            }}
            InputLabelProps={{
                style: {
                    fontSize: '0.8rem',
                },
                shrink: true,
                disableAnimation: true,
            }}
            value={data || ''}
            onChange={e => props.onChange(e.target.name, e.target.value)}
        />
    );
};

AuthorFieldData.propTypes = {
    authorFieldDataId: PropTypes.string,
    data: PropTypes.string,
    InputProps: PropTypes.object,
    onChange: PropTypes.func,
    title: PropTypes.string,
};

export default React.memo(AuthorFieldData);
