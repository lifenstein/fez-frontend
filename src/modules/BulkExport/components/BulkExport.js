import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Dialog from '@mui/material/Dialog';
import ErrorIcon from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import componentsLocale from 'locale/components';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogBody: {
        gap: '1rem',
        marginBottom: '2rem',
        maxWidth: '40em',
    },
    exportButton: {
        width: '100%',
        '&.loading': {
            background: theme.palette.accent.dark,
            color: theme.palette.primary.contrastText,
        },
        '&.success svg': {
            color: theme.palette.success.dark,
        },
        '&.error': {
            background: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
        },
    },
    dialogMobileMargins: {
        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },
    },
}));

const BulkExport = ({
    locale: { buttonText, rowLabel, sizeMessage, successMessage },
    exportPublications,
    pageSize,
    totalMatches,
    disabled,
    actions,
}) => {
    const { loadingByPage, loadedByPage } = useSelector(state => state.get('exportPublicationsReducer'));
    const [open, setOpen] = React.useState(false);
    const [exportPages, setExportPages] = React.useState([]);
    const hasSuccess = React.useRef(false);

    const classes = useStyles();

    const openDialog = () => {
        actions.resetExportPublicationsStatus();
        setOpen(true);
    };
    const closeDialog = () => {
        actions.resetExportPublicationsStatus();
        setOpen(false);
    };

    React.useEffect(() => {
        hasSuccess.current = false;
        const newExportPages = [];
        for (let start = 1; start < totalMatches; start += pageSize) {
            const end = Math.min(start + pageSize - 1, totalMatches);
            newExportPages.push({ start, end, number: newExportPages.length + 1 });
        }
        setExportPages(newExportPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMatches]);

    const exportConfig = componentsLocale.components.export;

    const exportButtonsRender = (format, page) => {
        const exportConfigKey = `${format.value}-page-${page.number}`;
        let statusClass = '';
        let statusIcon = (
            <CloudDownloadIcon
                size="2rem"
                id={`${exportConfigKey}-available`}
                data-testid={`${exportConfigKey}-available`}
            />
        );
        if (loadingByPage[exportConfigKey] === true) {
            statusClass = 'loading';
            statusIcon = (
                <CircularProgress
                    size="1.25rem"
                    id={`${exportConfigKey}-loading`}
                    data-testid={`${exportConfigKey}-loading`}
                    color="inherit"
                />
            );
        } else if (loadedByPage[exportConfigKey] === true) {
            hasSuccess.current = true;
            statusClass = 'success';
            statusIcon = (
                <CloudDoneIcon size="2rem" id={`${exportConfigKey}-loaded`} data-testid={`${exportConfigKey}-loaded`} />
            );
        } else if (loadingByPage[exportConfigKey] === false) {
            statusClass = 'error';
            statusIcon = (
                <ErrorIcon size="2rem" id={`${exportConfigKey}-error`} data-testid={`${exportConfigKey}-error`} />
            );
        }

        const id = `bulk-export-${format.value}-${page.start}-to-${page.end}`;
        return (
            <Button
                children={format.label}
                className={`${classes.exportButton} ${statusClass}`}
                data-testid={id}
                disabled={['success', 'loading'].includes(statusClass)}
                endIcon={statusIcon}
                fullWidth
                id={id}
                key={format.value}
                onClick={() => {
                    exportPublications({
                        exportPublicationsFormat: format.value,
                        page: page.number,
                        pageSize,
                        bulkExportSelected: true,
                    });
                }}
                variant="contained"
            />
        );
    };

    const exportOptionRender = exportPages.map(page => {
        const id = `bulk-export-row-heading-${page.number}`;
        return (
            <Grid item data-testid={id} id={id} xs={12} key={page.number}>
                <Grid container spacing={2}>
                    <Grid item xs="auto" sm={6} md={5}>
                        {rowLabel.replace('[start]', page.start).replace('[end]', page.end)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={7}>
                        <Grid container spacing={2}>
                            {exportConfig.format.map(format => (
                                <Grid item xs={12} md={6} key={`page-${page.start}-${format.value}`}>
                                    {exportButtonsRender(format, page)}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    });

    return (
        <div id="bulk-export" data-testid="bulk-export">
            <Button
                variant="contained"
                children={buttonText}
                disabled={open || disabled}
                onClick={openDialog}
                data-testid="bulk-export-open"
                id="bulk-export-open"
                color={'default'}
            />
            <Dialog
                open={open}
                aria-labelledby="bulk-export-dialog-title"
                aria-describedby="bulk-export-instructions"
                className={classes.root}
                maxWidth="md"
                classes={{
                    paperScrollPaper: classes.dialogMobileMargins,
                }}
            >
                <MuiDialogTitle disableTypography>
                    <Typography variant="h4" id="bulk-export-dialog-title">
                        {buttonText}
                    </Typography>
                    <IconButton aria-label="close" onClick={closeDialog} className={classes.closeButton} size="large">
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>
                <MuiDialogContent>
                    <Grid container spacing={2} className={classes.dialogBody}>
                        <Grid item xs={12} id="bulk-export-instructions">
                            {sizeMessage.replace('[bulkExportSize]', pageSize)}
                        </Grid>
                        {hasSuccess.current && (
                            <Grid item xs={12}>
                                <Alert message={successMessage} type="info" />
                            </Grid>
                        )}
                        {exportOptionRender}
                    </Grid>
                </MuiDialogContent>
            </Dialog>
        </div>
    );
};

BulkExport.propTypes = {
    exportPublications: PropTypes.func,
    locale: PropTypes.shape({
        buttonText: PropTypes.string,
        rowLabel: PropTypes.string,
        sizeMessage: PropTypes.string,
        successMessage: PropTypes.string,
    }),
    pageSize: PropTypes.number,
    totalMatches: PropTypes.number,
    disabled: PropTypes.bool,
    actions: PropTypes.object,
};

export default BulkExport;
