import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import locale from 'locale/components';

import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';
import { optionDoubleRowRender, defaultLegacyReportOption, exportReportFilters } from '../config';

const LegacyReportInterface = ({ id, loading, disabled, items, onExportClick }) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const exportReport = actionState.exportReport || defaultLegacyReportOption;

    const { isValid, ...validationErrors } = React.useMemo(() => {
        const exportReport = actionState.exportReport;
        let isValid = false;
        let validationResults = {};

        if (!!exportReport) {
            if (!!exportReport.sel_bindings) {
                validationResults = Object.keys(exportReportFilters).reduce(
                    (current, key) => ({
                        ...current,
                        ...(exportReportFilters[key]?.validator({ state: actionState, locale: txt }) || {}),
                    }),
                    {},
                );
                isValid = Object.keys(validationResults).length === 0;
            } else isValid = true;
        }
        return { isValid, ...validationResults };
    }, [txt, actionState]);

    const isDisabled = !isValid || disabled;

    const handleFilterChange = React.useCallback(value => {
        console.log(value);
        actionDispatch(value);
    }, []);

    const handleExportReportChange = React.useCallback((_, value) => {
        actionDispatch({ type: 'exportReport', value });
    }, []);

    const handleExportReport = React.useCallback(() => {
        onExportClick(exportReport.sel_id);
    }, [onExportClick, exportReport?.sel_id]);

    return (
        <Box id={id} data-testid={id}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        id={id}
                        disablePortal
                        options={items}
                        isOptionEqualToValue={(option, value) => option.sel_id === value.sel_id}
                        getOptionKey={option => option.sel_id}
                        getOptionLabel={option => option.sel_title}
                        renderOption={optionDoubleRowRender}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="standard"
                                label={txt.label.report}
                                helperText={txt.label.helperText}
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${id}-input`,
                                    'data-analyticsid': `${id}-input`,
                                    'data-testid': `${id}-input`,
                                    'aria-describedby': `${id}-label`,
                                }}
                                InputLabelProps={{
                                    'data-testid': `${id}-label`,
                                    htmlFor: `${id}-input`,
                                }}
                            />
                        )}
                        ListboxProps={{
                            id: `${id}-listbox`,
                            'data-analyticsid': `${id}-listbox`,
                            'data-testid': `${id}-listbox`,
                        }}
                        value={exportReport}
                        onChange={handleExportReportChange}
                        disabled={loading || disabled}
                    />
                </Grid>

                {Object.keys(exportReportFilters).map(key =>
                    exportReportFilters[key].component({
                        state: actionState,
                        id,
                        errorMessage: validationErrors,
                        onChange: handleFilterChange,
                        locale: txt,
                    }),
                )}

                <Grid item xs={12}>
                    <Button
                        id="report-export-button"
                        data-testid="report-export-button"
                        variant="contained"
                        onClick={handleExportReport}
                        disabled={isDisabled || loading}
                    >
                        {loading && (
                            <CircularProgress
                                color="inherit"
                                size={20}
                                id={'export-report-progress'}
                                data-testid={'export-report-progress'}
                                sx={{ mr: 1 }}
                            />
                        )}
                        {txt.label.exportReport}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

LegacyReportInterface.propTypes = {
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.array,
    exportReport: PropTypes.object,
    onChange: PropTypes.func,
    onExportClick: PropTypes.func,
};

export default React.memo(LegacyReportInterface);
