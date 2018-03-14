import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm, getFormValues, getFormSyncErrors, SubmissionError} from 'redux-form/immutable';
import Immutable from 'immutable';
import ClaimRecord from '../components/ClaimRecord';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';

const FORM_NAME = 'ClaimRecord';

const onSubmit = (values, dispatch) => {
    const data = {...values.toJS()};
    return dispatch(actions.claimPublication(data))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

let ClaimPublicationFormContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(ClaimRecord, FORM_NAME));

const mapStateToProps = (state) => {
    return {
        publicationToClaimFileUploadingError: state && state.get('claimPublicationReducer') ? state.get('claimPublicationReducer').publicationToClaimFileUploadingError : null,
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            publication: state && state.get('claimPublicationReducer') ? state.get('claimPublicationReducer').publicationToClaim : null,
            author: state && state.get('accountReducer') ? state.get('accountReducer').author : null
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

ClaimPublicationFormContainer = connect(mapStateToProps, mapDispatchToProps)(ClaimPublicationFormContainer);
ClaimPublicationFormContainer = withRouter(ClaimPublicationFormContainer);

export default ClaimPublicationFormContainer;
