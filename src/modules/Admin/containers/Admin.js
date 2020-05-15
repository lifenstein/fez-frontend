import * as actions from 'actions';
import { connect } from 'react-redux';
import { destroy, reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import AdminContainer from '../components/AdminContainer';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { withRouter } from 'react-router';
import { adminInterfaceConfig, valueExtractor, validate } from 'config/admin';
import { viewRecordsConfig } from 'config';
import { isFileValid } from 'config/validation';
import {
    DOCUMENT_TYPES_LOOKUP,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_SEMINAR_PAPER,
    RECORD_TYPE_COLLECTION,
    RECORD_TYPE_RECORD,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_REFERENCE_ENTRY,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
} from 'config/general';
import { bindActionCreators } from 'redux';
import { FORM_NAME } from '../constants';
import { publicationTypeHasAdvisoryStatement } from '../components/common/helpers';
import { onSubmit } from '../submitHandler';

export const bibliographicParams = record =>
    record.fez_record_search_key_language &&
    (record.fez_record_search_key_language.length > 1 ||
        (record.fez_record_search_key_language.length === 1 &&
            record.fez_record_search_key_language[0].rek_language !== 'eng'));

export const identifiersParams = record => ({
    displayAll: [
        PUBLICATION_TYPE_BOOK,
        PUBLICATION_TYPE_BOOK_CHAPTER,
        PUBLICATION_TYPE_CONFERENCE_PAPER,
        PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
        PUBLICATION_TYPE_JOURNAL,
        PUBLICATION_TYPE_JOURNAL_ARTICLE,
        PUBLICATION_TYPE_REFERENCE_ENTRY,
        PUBLICATION_TYPE_RESEARCH_REPORT,
        PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    ].includes(record.rek_display_type),
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
    const validDataStreams = (dataStreams || []).filter(isFileValid(viewRecordsConfig, true, true));

    return {
        initialValues: {
            pid: recordToView.rek_pid,
            publication: recordToView,
            rek_display_type: recordToView.rek_display_type,
            rek_date: recordToView.rek_date || recordToView.rek_created_date,
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
                        dataStreams: validDataStreams,
                    }
                    : []),
            },
            bibliographicSection:
                (recordType === RECORD_TYPE_RECORD &&
                    getInitialValues(recordToView, 'bibliographic', bibliographicParams)) ||
                {},
            authorsSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'authors')) || {},
            adminSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'admin')) || {},
            ntroSection: (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'ntro')) || {},
            grantInformationSection:
                (recordType === RECORD_TYPE_RECORD && getInitialValues(recordToView, 'grantInformation')) || {},
            filesSection:
                (recordType === RECORD_TYPE_RECORD && { fez_datastream_info: validDataStreams, ...rest }) || {},
        },
    };
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
    const newRecord = state.get('createAdminRecordReducer') && state.get('createAdminRecordReducer').newRecord;
    let initialFormValues = {};
    let recordToView = {};

    if (props.createMode) {
        const displayType = formValues && formValues.get('rek_display_type');
        const selectedSubType =
            formValues &&
            ((!!formValues.get('adminSection') && formValues.get('adminSection').toJS()) || {}).rek_subtype;
        const recordType = RECORD_TYPE_RECORD;

        recordToView = {
            rek_pid: (newRecord && newRecord.rek_pid) || null,
            rek_display_type: displayType,
            rek_subtype: selectedSubType,
            rek_object_type_lookup: recordType,
        };
        initialFormValues = {
            initialValues: {
                bibliographicSection: {
                    languages: ['eng'],
                },
            },
        };
    } else {
        recordToView = state.get('viewRecordReducer').recordToView;
        const recordType = ((recordToView || {}).rek_object_type_lookup || '').toLowerCase();
        initialFormValues =
            (!!recordToView && recordToView.rek_pid && getInitialFormValues(recordToView, recordType)) || {};
    }

    return {
        formValues,
        formErrors,
        disableSubmit:
            !!recordToView &&
            !!recordToView.rek_display_type &&
            typeof DOCUMENT_TYPES_LOOKUP[recordToView.rek_display_type] !== 'undefined' &&
            formErrors &&
            !(formErrors instanceof Immutable.Map),
        loadingRecordToView: state.get('viewRecordReducer').loadingRecordToView,
        authorDetails: state.get('accountReducer').authorDetails || null,
        author: state.get('accountReducer').author,
        recordToView,
        ...initialFormValues,
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
