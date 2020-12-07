/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableAction, MTableBodyRow, MTableEditRow } from 'material-table';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Typography from '@material-ui/core/Typography';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField } from 'modules/SharedComponents/LookupFields';
import { default as locale } from 'locale/components';

import { EDITORIAL_ROLE_MAP, EDITORIAL_ROLE_OPTIONS } from 'config/general';

export const getColumns = () => {
    const {
        header: {
            columns: { journalName, role, startYear, endYear },
        },
        form: {
            locale: {
                journalNameLabel,
                journalNameHint,
                editorialRoleLabel,
                editorialRoleHint,
                startYearLabel,
                startYearHint,
                endYearLabel,
                endYearHint,
            },
        },
    } = locale.components.myEditorialAppointmentsList;
    return [
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {journalName.title}
                </Typography>
            ),
            field: 'eap_journal_name',
            render: rowData => (
                <Typography
                    variant="body2"
                    data-testid={`eap-journal-name-${rowData.tableData.id}`}
                    id={`eap-journal-name-${rowData.tableData.id}`}
                >
                    {rowData.eap_journal_name}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;
                return (
                    <TextField
                        autoFocus
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        textFieldId="eap-journal-name"
                        error={(rowData.eap_journal_name || '').length === 0}
                        label={journalNameLabel}
                        placeholder={journalNameHint}
                        required
                        fullWidth
                    />
                );
            },
            validate: rowData => rowData.eap_journal_name !== '',
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {role.title}
                </Typography>
            ),
            field: 'eap_role_name',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-role-name-${rowData.tableData.id}`}
                    data-testid={`eap-role-name-${rowData.tableData.id}`}
                >
                    {rowData.eap_role_name}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;
                const handleChange = selectedItem => {
                    const newValue = {
                        eap_role_name: selectedItem,
                        eap_role_cvo_id: Object.keys(EDITORIAL_ROLE_MAP).find(
                            key => EDITORIAL_ROLE_MAP[key] === selectedItem,
                        ),
                    };
                    props.onRowDataChange({ ...rowData, ...newValue });
                };
                const handleClear = () =>
                    props.onRowDataChange({ ...rowData, eap_role_name: null, eap_role_cvo_id: null });

                return (
                    <RoleField
                        {...props}
                        autoCompleteSelectFieldId="eap-role-name"
                        fullWidth
                        clearable
                        key={`editorial-appointment-role-${rowData.eap_role_cvo_id}`}
                        id="editorial-appointment-role"
                        floatingLabelText={editorialRoleLabel}
                        hintText={editorialRoleHint}
                        onChange={handleChange}
                        onClear={handleClear}
                        itemsList={EDITORIAL_ROLE_OPTIONS}
                        required
                        autoComplete="off"
                        error={(rowData.eap_role_name || '').trim().length === 0}
                        value={rowData.eap_role_name}
                    />
                );
            },
            validate: rowData => rowData.eap_role_name !== null,
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {startYear.title}
                </Typography>
            ),
            field: 'eap_start_year',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-start-year-${rowData.tableData.id}`}
                    data-testid={`eap-start-year-${rowData.tableData.id}`}
                >
                    {rowData.eap_start_year}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;
                return (
                    <TextField
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        textFieldId="eap-start-year"
                        error={(rowData.eap_start_year || '').length === 0}
                        label={startYearLabel}
                        placeholder={startYearHint}
                        required
                        fullWidth
                    />
                );
            },
            validate: rowData => rowData.eap_start_year !== '',
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {endYear.title}
                </Typography>
            ),
            field: 'eap_end_year',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-end-year-${rowData.tableData.id}`}
                    data-testid={`eap-end-year-${rowData.tableData.id}`}
                >
                    {rowData.eap_end_year}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;
                return (
                    <TextField
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        textFieldId="eap-end-year"
                        error={(rowData.eap_end_year || '').length === 0}
                        label={endYearLabel}
                        placeholder={endYearHint}
                        required
                        fullWidth
                    />
                );
            },
            validate: rowData => rowData.eap_end_year !== '',
        },
    ];
};

export const MyEditorialAppointmentsList = ({ disabled, handleRowUpdate, list }) => {
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [data, setData] = React.useState(list);

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => (
                    <div {...props} id="my-editorial-appointments-list" data-testid="my-editorial-appointments-list" />
                ),
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        id={`my-editorial-appointments-list-row-${props.index}`}
                        data-testid={`my-editorial-appointments-list-row-${props.index}`}
                    />
                ),
                EditRow: props => (
                    <MTableEditRow
                        {...props}
                        id={`my-editorial-appointments-list-edit-row-${props.index}`}
                        data-testid={`my-editorial-appointments-list-edit-row-${props.index}`}
                    />
                ),
                Action: props => {
                    if (typeof props.action !== 'function' && !props.action.action && !props.action.isFreeAction) {
                        //  Save or Cancel actions for Add/Edit/Delete actions
                        const { icon: Icon, tooltip, ...restAction } = props.action;
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    icon: () => (
                                        <Icon
                                            id={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase()}`}
                                            data-testid={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else if (typeof props.action === 'function') {
                        const { icon: Icon, tooltip, ...restAction } = props.action(props.data);
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    tooltip,
                                    icon: () => (
                                        <Icon
                                            disabled={disabled}
                                            id={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase()}`}
                                            data-testid={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else {
                        return <MTableAction {...props} />;
                    }
                },
            }}
            data={data}
            icons={tableIcons}
            title=""
            editable={{
                onRowUpdateCancelled: () => {},
                onRowUpdate: (newData, oldData) => {
                    return handleRowUpdate(newData, oldData)
                        .then(() => {
                            setData(prevState => {
                                const data = [...prevState];
                                data[data.indexOf(oldData)] = newData;
                                return data;
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
            }}
            options={{
                actionsColumnIndex: -1,
                paging: false,
                search: data.length > 10,
            }}
        />
    );
};

MyEditorialAppointmentsList.propTypes = {
    disabled: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
};

export default React.memo(MyEditorialAppointmentsList);