import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import locale from 'locale/pages';
import { ORG_NAME_MATCH_TEXT, RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY } from 'config/general';
import { pathConfig } from 'config/routes';
import { DOI_ORG_PREFIX, doiFields } from 'config/doi';
import { validation } from 'config';

import { useConfirmationState } from 'hooks';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { getFileOpenAccessStatus } from 'modules/ViewRecord/components/Files';
import DoiPreview from './DoiPreview';

const txt = locale.pages.doi;

const renderWarningItem = (item, index) => {
    const id = `doi-warning-${index}`;
    return (
        <li data-testid={id} key={id}>
            {item}
        </li>
    );
};

export const getWarningMessage = record => {
    // Collect warnings
    const warnings = [];

    // Need to show a warning if publisher is not UQ
    if (
        !record.fez_record_search_key_org_name ||
        !(typeof record.fez_record_search_key_org_name.rek_org_name === 'string') ||
        !record.fez_record_search_key_org_name.rek_org_name.includes(ORG_NAME_MATCH_TEXT)
    ) {
        warnings.push(txt.warningMessages.uqIsNotPublisher);
    }

    // Need to show a warning if record doesn't have open-access datastreams
    const dataStreamIsOpenAccess = datastream =>
        getFileOpenAccessStatus(record, datastream, { isAdmin: true }).isOpenAccess;
    if (!record.fez_datastream_info || record.fez_datastream_info.filter(dataStreamIsOpenAccess).length === 0) {
        warnings.push(txt.warningMessages.noOADatastreams);
    }

    if (warnings.length === 0) {
        return '';
    }

    return (
        <span>
            <Typography variant="h3" style={{ fontSize: 20, marginTop: 6 }}>
                {txt.warningMessages.title}
            </Typography>
            <ul>{warnings && warnings.length > 0 && warnings.map(renderWarningItem)}</ul>
        </span>
    );
};

const renderTitle = titlePieces => {
    const titleTemplate = txt.pageTitle({ ...titlePieces, title: '%TITLE%' });
    const pieces = titleTemplate.split('%TITLE%');
    return (
        <Typography variant="h2" color="primary" style={{ fontSize: 24 }} data-testid="page-title">
            {pieces[0]}
            {ReactHtmlParser(titlePieces.title)}
            {pieces[1]}
        </Typography>
    );
};

export const Doi = ({
    author,
    clearRecordToView,
    doiRequesting,
    doiUpdated,
    doiFailed,
    handleSubmit,
    loadingRecordToView,
    loadRecordToView,
    match,
    record,
}) => {
    React.useEffect(() => {
        // Load record if it hasn't
        !!match.params.pid && !!loadRecordToView && loadRecordToView(match.params.pid);
        return () => {
            // Clear current record on unload
            clearRecordToView();
        };
    }, [clearRecordToView, loadRecordToView, match.params.pid]);

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    /* istanbul ignore next */
    React.useEffect(() => {
        if (doiUpdated) {
            showConfirmation();
        }
    }, [showConfirmation, doiUpdated]);

    // Get subkeys where present
    const doi = !!record && !!record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
    const recordType = (!!record && record.rek_object_type_lookup) || '';
    const displayType = !!record && record.rek_display_type;
    const displayTypeLookup = !!record && record.rek_display_type_lookup;
    const title = !!record && !!record.rek_title && record.rek_title;
    const pid = !!record && record.rek_pid;

    // Need to filter out community and collection pids
    const isRecord = ![RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY].includes(recordType.toLowerCase());

    // Need to avoid unsupported display types
    const unsupportedType = !!displayType && !doiFields[displayType];

    // Should not allow updates of existing Non-UQ DOIs
    const hasNonUQDoi = !!doi && doi.indexOf(DOI_ORG_PREFIX) !== 0;

    if (!!match.params.pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    if (!!match.params.pid && !pid) {
        return <div className="empty" />;
    }

    const warningMessage = getWarningMessage(record);

    const navigateToViewPage = () => window.location.assign(pathConfig.records.view(pid, true));

    const alertProps = validation.getErrorAlertProps({
        alertLocale: txt.alertProps,
        error: doiFailed,
        submitSucceeded: doiUpdated,
        submitting: doiRequesting,
    });

    return (
        <StandardPage>
            {!!pid && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {renderTitle({ doi, displayTypeLookup, title, pid })}
                        <PublicationCitation publication={record} hideTitle hideCitationCounts hideContentIndicators />
                    </Grid>
                    <Grid item xs={12}>
                        {isRecord && !unsupportedType && !!warningMessage && (
                            <Alert message={warningMessage} type="warning" />
                        )}
                        {(unsupportedType || !isRecord) && (
                            <Alert message={txt.unsupportedMessage(displayTypeLookup || recordType)} type="error" />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <ConfirmationBox
                            confirmationBoxId="rek-doi"
                            hideCancelButton
                            isOpen={isOpen}
                            locale={txt.successConfirmation}
                            onAction={navigateToViewPage}
                            onClose={hideConfirmation}
                        />
                        <DoiPreview author={author} publication={record} />
                    </Grid>
                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert testId="rek-doi-submit-status" {...alertProps} />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={false} sm />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    id="rek-doi-cancel"
                                    data-testid="rek-doi-cancel"
                                    variant="contained"
                                    fullWidth
                                    disabled={doiRequesting}
                                    onClick={navigateToViewPage}
                                >
                                    {txt.cancelButtonLabel}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm="auto">
                                <Button
                                    id="rek-doi-submit"
                                    data-testid="rek-doi-submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleSubmit(record)}
                                    disabled={doiRequesting || !isRecord || unsupportedType || hasNonUQDoi}
                                >
                                    {txt.confirmButtonLabel(!!doi)}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

Doi.propTypes = {
    author: PropTypes.object,
    clearRecordToView: PropTypes.func,
    doiFailed: PropTypes.bool,
    doiRequesting: PropTypes.bool,
    doiUpdated: PropTypes.bool,
    handleSubmit: PropTypes.func,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    match: PropTypes.object,
    record: PropTypes.object,
};

export default Doi;
