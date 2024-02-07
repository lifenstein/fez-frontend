import { connect } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';

import * as actions from 'actions/viewControlledVocab';
import AdminPanel from './AdminPanel';

const FORM_NAME = 'ControlledVocabAdmin';

const rxWholeNumberOnly = new RegExp(/^\d+$/);

const validate = data => {
    const values = data.toJS();
    const errors = {};
    if (!values.cvo_title) {
        errors.cvo_title = 'Required';
    } else if (values.cvo_title.length > 255) {
        errors.cvo_title = 'Must be 255 characters or less';
    }
    if (!!values.cvo_desc && values.cvo_desc.length > 255) {
        errors.cvo_desc = 'Must be 255 characters or less';
    }

    if (typeof values.cvo_order !== 'undefined' && values.cvo_order !== '') {
        const num = Number(values.cvo_order);
        if (isNaN(num)) errors.cvo_order = 'Must be a number';
        else if (!rxWholeNumberOnly.test(values.cvo_order)) {
            errors.cvo_order = 'Must be a whole number above zero';
        }
    }

    return errors;
};

const mapStateToProps = (state, props) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    console.log(props);
    return {
        onSubmit: props.onAction(props.parentId ?? null),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: (state && state.get('vocabAdminReducer') && state.get('vocabAdminReducer').vocab) || {},
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const AdminPanelContainer = reduxForm({
    form: FORM_NAME,
    validate,
})(AdminPanel);

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelContainer);
