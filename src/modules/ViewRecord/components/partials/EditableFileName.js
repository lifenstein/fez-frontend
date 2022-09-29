import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Hidden } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles } from '@material-ui/core/styles';

import FileName from './FileName';
import { FileNameProps } from './FileName';

const useStyles = makeStyles(() => ({
    labelTruncated: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
}));

const EditableFileName = ({
    onFileNameChange,
    onFileSaveFilename,
    handleFileIsValid,
    onFileCancelEdit,
    filenameRestrictions,
    ...props
}) => {
    const classes = useStyles();
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const isEdited = useRef(false);
    const originalFilenameRef = useRef(null);
    const originalFilenameExtRef = useRef(null);
    const editedFilenameRef = useRef(null);
    const [proxyFilename, setProxyFilename] = useState(props.filename);

    const getFilenamePart = filename => filename.split('.').shift();
    /* istanbul ignore next */
    const getNewFilename = filename => `${filename}.${originalFilenameExtRef.current}`;

    useEffect(() => {
        // update state of filename whenever a new value is passed in props.
        // this will happen whenever several of the functions below fire
        setProxyFilename(getFilenamePart(props.fileName));

        // set edit flag whenever the filename changes
        /* istanbul ignore next */
        !!originalFilenameRef.current && (isEdited.current = props.fileName !== originalFilenameRef.current);

        /* istanbul ignore next */
        if (!!originalFilenameRef.current && !isEditing) {
            onFileCancelEdit?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fileName]);

    /* istanbul ignore next */
    const onFilenameChangeProxy = event => {
        // update local filename proxy state var to avoid
        // input lag as the user types

        /* istanbul ignore next */
        setProxyFilename(event.target.value);
    };

    const handleFileCancelEdit = () => {
        // exit editing mode and set valid to true (last known state)
        setIsEditing(false);
        setIsValid(true);
        // set edited flag
        /* istanbul ignore next */
        isEdited.current = !!editedFilenameRef.current && editedFilenameRef.current !== originalFilenameRef.current;
        // reset the filename to the last previous state (which may be an edited filename)
        setProxyFilename(getFilenamePart(editedFilenameRef.current ?? originalFilenameRef.current));
    };

    const handleFileEditFilename = () => {
        // save the initial filename in case we need to reset
        !!!originalFilenameRef.current && (originalFilenameRef.current = props.fileName);
        !!!originalFilenameExtRef.current && (originalFilenameExtRef.current = props.fileName.split('.').pop());
        setIsEditing(true);
    };
    /* istanbul ignore next */
    const handleFileSaveFilename = () => {
        /* istanbul ignore next */
        const newFilename = getNewFilename(proxyFilename);
        /* istanbul ignore next */
        const isValid = new RegExp(filenameRestrictions, 'gi').test(newFilename);
        /* istanbul ignore next */
        setIsValid(isValid);
        // only allow exit from edit mode if the entered filename is valid

        /* istanbul ignore next */
        if (isValid) {
            /* istanbul ignore next */
            editedFilenameRef.current = newFilename;
            /* istanbul ignore next */
            setIsEditing(false);
            /* istanbul ignore next */
            onFileSaveFilename?.(originalFilenameRef.current, newFilename);
            // onFileNameChange(editedFilenameRef.current);
        }
    };

    /* istanbul ignore next */
    const handleFileRestoreFilename = () => {
        /* istanbul ignore next */
        isEdited.current = false;
        /* istanbul ignore next */
        setIsValid(true);
        /* istanbul ignore next */
        editedFilenameRef.current = null;

        // reset filename to original value
        /* istanbul ignore next */
        onFileNameChange(originalFilenameRef.current);
    };

    /* istanbul ignore next */
    const handleKeyPress = (key, callbackFn) => {
        /* istanbul ignore next */
        if (key.code.toLowerCase() === 'enter' || key.code.toLowerCase() === 'numpadenter') {
            /* istanbul ignore next */
            key.preventDefault();
            /* istanbul ignore next */
            callbackFn?.(originalFilenameRef.current);
        }
    };

    useEffect(() => {
        handleFileIsValid?.(isEditing ? false : isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, isValid]);

    return (
        <>
            {!isEditing ? (
                <>
                    <Hidden smDown>
                        <Grid container alignItems={'center'} wrap="nowrap">
                            <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                                {!!!isEdited.current && <FileName {...props} />}
                                {!!isEdited.current && (
                                    /* istanbul ignore next */
                                    <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
                                        {editedFilenameRef.current}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs>
                                <IconButton
                                    aria-label="rename file"
                                    onClick={handleFileEditFilename}
                                    size={'small'}
                                    id={`${props.id}-edit`}
                                    data-testid={`${props.id}-edit`}
                                >
                                    <EditIcon />
                                </IconButton>
                                {!!isEdited.current && (
                                    /* istanbul ignore next */
                                    <IconButton
                                        aria-label="reset file name"
                                        onClick={handleFileRestoreFilename}
                                        size={'small'}
                                        id={`${props.id}-reset`}
                                        data-testid={`${props.id}-reset`}
                                    >
                                        <ReplayIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        {!!!isEdited.current && <FileName {...props} />}
                        {!!isEdited.current && (
                            /* istanbul ignore next */
                            <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
                                {editedFilenameRef.current}
                            </Typography>
                        )}
                    </Hidden>
                </>
            ) : (
                <Input
                    autoFocus
                    required
                    error={!isValid}
                    type={'text'}
                    value={proxyFilename}
                    onChange={onFilenameChangeProxy}
                    onKeyPress={
                        /* istanbul ignore next */
                        key =>
                            /* istanbul ignore next */
                            handleKeyPress(key, handleFileSaveFilename)
                    }
                    id={`${props.id}-editing`}
                    data-testid={`${props.id}-editing`}
                    endAdornment={
                        <>
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="save rename"
                                    onClick={handleFileSaveFilename}
                                    size={'small'}
                                    id={`${props.id}-save`}
                                    data-testid={`${props.id}-save`}
                                >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="cancel rename"
                                    onClick={handleFileCancelEdit}
                                    size={'small'}
                                    id={`${props.id}-cancel`}
                                    data-testid={`${props.id}-cancel`}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        </>
                    }
                />
            )}
        </>
    );
};

export const EditableFileNameProps = {
    onFileNameChange: PropTypes.func,
    onFileSaveFilename: PropTypes.func,
    onFileCancelEdit: PropTypes.func,
    handleFileIsValid: PropTypes.func,
    filenameRestrictions: PropTypes.any,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
