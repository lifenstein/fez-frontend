import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';
import {validation} from 'config';
import {StandardCard} from 'uqlibrary-react-toolbox';
import {OrgUnitsField, SeriesField} from 'modules/SharedComponents/AutoSuggestField';

export default class WorkingPaperForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <StandardCard title="Placeholder for working paper">
                    <Field
                        component={OrgUnitsField}
                        name="testField"
                        floatingLabelText="OrgNameField 1"
                        disabled={this.props.submitting}

                    />
                    <Field
                        component={SeriesField}
                        name="testField2"
                        floatingLabelText="SeriesField 1"
                        disabled={this.props.submitting}

                    />
                    <Field
                        component={OrgUnitsField}
                        name="testField3"
                        floatingLabelText="OrgNameField 2"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                    <Field
                        component={SeriesField}
                        name="testField4"
                        floatingLabelText="SeriesField 2"
                        disabled={this.props.submitting}
                        className="requiredField"
                        validate={[validation.required]}

                    />
                </StandardCard>
            </div>
        );
    }
}
