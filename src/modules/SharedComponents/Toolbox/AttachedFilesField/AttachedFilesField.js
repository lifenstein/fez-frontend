/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
import { useFormValuesContext } from 'context';

export const AttachedFilesField = ({ input, ...props }) => {
    const { formValues, onDeleteAttachedFile } = useFormValuesContext();

    const [dataStreams, setDataStreams] = useState(
        !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [],
    );
    const { onChange } = input;

    /* istanbul ignore next */
    const handleDelete = useCallback(
        index => {
            /* istanbul ignore next */
            const fileToDelete = dataStreams[index];
            /* istanbul ignore next */
            const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
            /* istanbul ignore next */
            onDeleteAttachedFile(fileToDelete);
            /* istanbul ignore next */
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    const handleDataStreamChange = useCallback(
        /* istanbul ignore next */
        (key, value, index) => {
            /* istanbul ignore next */
            const newDataStreams = [
                ...dataStreams.slice(0, index),
                { ...dataStreams[index], [key]: value },
                ...dataStreams.slice(index + 1),
            ];
            /* istanbul ignore next */
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    const handleMultiDataStreamChange = useCallback(
        /* istanbul ignore next */
        (keyValuePairs, index) => {
            /* istanbul ignore next */
            let newDataStreams = [...dataStreams];
            /* istanbul ignore next */
            keyValuePairs.forEach(
                /* istanbul ignore next */
                pair =>
                    /* istanbul ignore next */
                    (newDataStreams = [
                        ...newDataStreams.slice(0, index),
                        { ...newDataStreams[index], [pair.key]: pair.value },
                        ...newDataStreams.slice(index + 1),
                    ]),
            );
            /* istanbul ignore next */
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    /* istanbul ignore next */
    useEffect(() => /* istanbul ignore next */ onChange(dataStreams), [dataStreams]);

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDataStreamChange}
            onDescriptionChange={handleDataStreamChange}
            onFilenameChange={handleDataStreamChange}
            onFilenameSave={handleMultiDataStreamChange}
            onHandleFileIsValid={handleDataStreamChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
