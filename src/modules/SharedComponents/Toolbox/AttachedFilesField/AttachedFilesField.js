/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
// import { useFormValuesContext } from 'context';
import { useFormContext } from 'react-hook-form';

export const deleteCallbackFactory = (dataStreams, setDataStreams, onDeleteAttachedFile) => {
    const callback = key => {
        const indexToDelete = dataStreams.findIndex(item => item.dsi_dsid === key);
        const fileToDelete = dataStreams[indexToDelete];
        const newDataStreams = [...dataStreams.slice(0, indexToDelete), ...dataStreams.slice(indexToDelete + 1)];
        onDeleteAttachedFile(fileToDelete);
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams, onDeleteAttachedFile]];
};

export const datastreamOrderChangeCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = (fileId, oldPosition, newPosition) => {
        const newDataStreams = [...dataStreams];

        newDataStreams.map(
            (item, index) =>
                (item.dsi_order = item.hasOwnProperty('dsi_order') && !!item.dsi_order ? item.dsi_order : index + 1),
        );

        const sourceFileIndex = newDataStreams.findIndex(item => item.dsi_id === fileId);
        const replaceFileIndex = newDataStreams.findIndex(item => item.dsi_order === newPosition);

        newDataStreams[sourceFileIndex].dsi_order = newPosition;
        newDataStreams[replaceFileIndex].dsi_order = oldPosition;

        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
};

export const handleDatastreamChange = (dataStreams, setDataStreams /* , onRenameAttachedFile*/) => (
    key,
    value,
    index,
    // previousFilename,
) => {
    const newDataStreams = [...dataStreams];
    newDataStreams[index][key] = value;
    //  !!previousFilename && onRenameAttachedFile(previousFilename, value);
    setDataStreams(newDataStreams);
};

export const handleDatastreamMultiChange = (dataStreams, setDataStreams, onRenameAttachedFile) => (
    keyValuePairs,
    previousFilename,
    index,
) => {
    const newDataStreams = [...dataStreams];
    keyValuePairs.forEach(pair => (newDataStreams[index][pair.key] = pair.value));
    const fileToRename = dataStreams[index];
    onRenameAttachedFile(previousFilename ?? fileToRename.dsi_dsid_new, fileToRename.dsi_dsid);
    setDataStreams(newDataStreams);
};

export const handleOnChange = (dataStreams, onChange) => {
    onChange(dataStreams);
};

export const AttachedFilesField = props => {
    // const { formValues, onDeleteAttachedFile, onRenameAttachedFile } = useFormValuesContext();
    const methods = useFormContext();
    console.log(methods, props);
    const rhfFormValues = (!!methods.getValues && methods.getValues()) ?? undefined;
    console.log(rhfFormValues);
    const ds = React.useMemo(
        () =>
            !!rhfFormValues.filesSection?.fez_datastream_info ? rhfFormValues.filesSection?.fez_datastream_info : [],
        [rhfFormValues.filesSection?.fez_datastream_info],
    );

    const [dataStreams, setDataStreams] = useState(ds);

    React.useEffect(() => {
        setDataStreams(ds);
    }, [ds]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDataStreamOrderChange = useCallback(
        ...datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, setDataStreams /* , onDeleteAttachedFile*/));

    useEffect(() => {
        // Called when attachment is deleted in the UI
        return handleOnChange(dataStreams, props?.onChange || props.input?.onChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataStreams]);

    const onRenameAttachedFile = () => {};

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onDescriptionChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onFilenameChange={handleDatastreamChange(dataStreams, setDataStreams, onRenameAttachedFile)}
            onFilenameSave={handleDatastreamMultiChange(dataStreams, setDataStreams, onRenameAttachedFile)}
            onHandleFileIsValid={handleDatastreamChange(dataStreams, setDataStreams)}
            onOrderChange={handleDataStreamOrderChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    onChange: PropTypes.func,
    input: PropTypes.object,
    meta: PropTypes.object,
};
