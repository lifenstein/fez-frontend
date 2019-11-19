import * as actions from 'actions';
import { connect } from 'react-redux';
import { destroy, reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { adminUpdate, adminCreate } from 'actions';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { withRouter } from 'react-router';
import { adminInterfaceConfig, valueExtractor, validate } from 'config/admin';
import { viewRecordsConfig } from 'config';
import { isFileValid } from 'config/validation';
import {
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_SEMINAR_PAPER,
    RECORD_TYPE_COLLECTION,
    RECORD_TYPE_RECORD,
} from 'config/general';
import { bindActionCreators } from 'redux';
import { FORM_NAME } from '../constants';
import { detailedDiff } from 'deep-object-diff';
import { pathConfig } from 'config/routes';
import { publicationTypeHasAdvisoryStatement } from '../components/common/helpers';

export const bibliographicParams = record =>
    record.fez_record_search_key_language &&
    (record.fez_record_search_key_language.length > 1 ||
        (record.fez_record_search_key_language.length === 1 &&
            record.fez_record_search_key_language[0].rek_language !== 'eng'));

export const identifiersParams = record => ({
    displayLocation: [PUBLICATION_TYPE_AUDIO_DOCUMENT, PUBLICATION_TYPE_SEMINAR_PAPER].includes(
        record.rek_display_type,
    ),
    displayIdentifiers: PUBLICATION_TYPE_AUDIO_DOCUMENT === record.rek_display_type,
});

export const filesParams = record => ({
    isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
    displayAdvisoryStatement: publicationTypeHasAdvisoryStatement(record),
});

const getInitialValues = (record, tab, tabParams = () => {}) => {
    // collections and communities dont have this setup
    if (typeof adminInterfaceConfig[record.rek_display_type] === 'undefined') {
        return false;
    }
    return (adminInterfaceConfig[record.rek_display_type] || {})
        [tab](tabParams(record))
        .map(card => card.groups.reduce((groups, group) => [...groups, ...group], []))
        .reduce((groups, group) => [...groups, ...group], [])
        .reduce((initialValue, field) => {
            return {
                ...initialValue,
                [field]: valueExtractor[field].getValue(record),
            };
        }, {});
};

const getInitialFormValues = (recordToView, recordType) => {
    const { fez_datastream_info: dataStreams, ...rest } = getInitialValues(recordToView, 'files', filesParams);
    const validDataStreams = (dataStreams || []).filter(isFileValid(viewRecordsConfig, true));

    return {
        initialValues: {
            pid: recordToView.rek_pid,
            publication: recordToView,
            rek_display_type: recordToView.rek_display_type,
            rek_date: recordToView.rek_date || recordToView.rek_created_date,
            adminSection: {
                rek_herdc_notes: {
                    plainText: (recordToView || {}).rek_herdc_notes,
                    htmlText: (recordToView || {}).rek_herdc_notes,
                },
                internalNotes: {
                    plainText: ((recordToView || {}).fez_internal_notes || {}).ain_detail,
                    htmlText: ((recordToView || {}).fez_internal_notes || {}).ain_detail,
                },
            },
            identifiersSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'identifiers', identifiersParams)) ||
                {},
            securitySection: {
                rek_security_policy: recordToView.rek_security_policy,
                ...(recordType === RECORD_TYPE_COLLECTION
                    ? {
                        rek_datastream_policy: recordToView.rek_datastream_policy,
                    }
                    : {}),
                ...(recordType === RECORD_TYPE_RECORD
                    ? {
                        rek_security_inherited: recordToView.rek_security_inherited,
                        dataStreams: validDataStreams.map(
                            ({ dsi_dsid: name, dsi_security_inherited: inherited, dsi_security_policy: policy }) => ({
                                dsi_dsid: name,
                                dsi_security_inherited: inherited,
                                dsi_security_policy: policy,
                            }),
                        ),
                    }
                    : []),
            },
            bibliographicSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'bibliographic', bibliographicParams)) ||
                {},
            authorsSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'authors')) || {},
            additionalInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'additionalInformation')) || {},
            ntroSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'ntro')) || {},
            grantInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'grantInformation')) || {},
            filesSection:
                (recordType === RECORD_TYPE_RECORD && { fez_datastream_info: validDataStreams, ...rest }) || {},
        },
    };
};

const onSubmit = (values, dispatch, { initialValues, match }) => {
    console.log(detailedDiff((initialValues && initialValues.toJS()) || null, (values && values.toJS()) || null));
    let action = null;
    if (match.url === pathConfig.admin.edit(match.params.pid || '')) {
        action = adminUpdate;
    } else {
        action = adminCreate;
    }

    return dispatch(action(values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error });
    });
};

const PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
    validate,
    destroyOnUnmount: false,
})(confirmDiscardFormChanges(AdminContainer, FORM_NAME));

const mapStateToProps = (state, props) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    let initialFormValues = {};
    let recordToView = {};

    if (props.createMode) {
        const displayType = formValues && formValues.get('rek_display_type');
        const selectedSubType =
            formValues &&
            (
                (!!formValues.get('additionalInformationSection') &&
                    formValues.get('additionalInformationSection').toJS()) ||
                {}
            ).rek_subtype;
        const recordType = RECORD_TYPE_RECORD;

        recordToView = {
            rek_display_type: displayType,
            rek_subtype: selectedSubType,
            rek_object_type_lookup: recordType,
        };
    } else {
        recordToView = state.get('viewRecordReducer').recordToView;
        const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();
        initialFormValues =
            (!!recordToView && recordToView.rek_pid && getInitialFormValues(recordToView, recordType)) || {};
    }

    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        loadingRecordToView: state.get('viewRecordReducer').loadingRecordToView,
        authorDetails: state.get('accountReducer').authorDetails || null,
        author: state.get('accountReducer').author,
        recordToView,
        ...(!!initialFormValues ? initialFormValues : {}),
    };
};

function mapDispatchToProps(dispatch) {
    const { loadRecordToView, clearRecordToView } = bindActionCreators(actions, dispatch);
    return {
        loadRecordToView,
        clearRecordToView,
        destroy,
    };
}

const AdminReduxFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PrototypeContainer);

export default withRouter(AdminReduxFormContainer);
