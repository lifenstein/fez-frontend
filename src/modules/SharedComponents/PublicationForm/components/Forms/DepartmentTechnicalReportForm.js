import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { SeriesField, ReportNumberField, OrgUnitNameField, OrgNameField } from 'modules/SharedComponents/LookupFields';

import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class DepartmentTechnicalReportForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = formLocale.departmentTechnicalReport;
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    autoFocus
                                    disabled={this.props.submitting}
                                    name="rek_title"
                                    textFieldId="rek-title"
                                    required
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.information.fieldLabels.documentTitle}
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={OrgUnitNameField}
                                    name="fez_record_search_key_org_unit_name.rek_org_unit_name"
                                    disabled={this.props.submitting}
                                    {...txt.information.fieldLabels.orgUnitName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={OrgNameField}
                                    name="fez_record_search_key_org_name.rek_org_name"
                                    disabled={this.props.submitting}
                                    {...txt.information.fieldLabels.orgName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={SeriesField}
                                    name="fez_record_search_key_series.rek_series"
                                    disabled={this.props.submitting}
                                    {...txt.information.fieldLabels.series}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={ReportNumberField}
                                    name="fez_record_search_key_report_number.rek_report_number"
                                    disabled={this.props.submitting}
                                    {...txt.information.fieldLabels.reportNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_doi.rek_doi"
                                    textFieldId="rek-doi"
                                    type="text"
                                    fullWidth
                                    validate={[validation.doi]}
                                    {...txt.information.fieldLabels.doi}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    partialDateFieldId="rek-date"
                                    disabled={this.props.submitting}
                                    name="rek_date"
                                    allowPartial
                                    required
                                    className="requiredHintField"
                                    validate={[validation.required]}
                                    floatingTitle={txt.information.fieldLabels.date.title}
                                    floatingTitleRequired
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_description"
                                    textFieldId="rek-description"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...txt.information.fieldLabels.abstract}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.authors.title} help={txt.authors.help}>
                        <Typography>{txt.authors.description}</Typography>
                        <Field
                            component={ContributorsEditorField}
                            contributorEditorId="authors"
                            name="authors"
                            locale={txt.authors.field}
                            showContributorAssignment
                            required
                            validate={[validation.authorRequired]}
                            disabled={this.props.submitting}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.other.title} help={txt.other.help}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="comments"
                                    textFieldId="comments"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    {...txt.other.fieldLabels.notes}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link"
                                    textFieldId="rek-link"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    {...txt.other.fieldLabels.url}
                                    validate={[validation.url]}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
