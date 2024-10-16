import React from 'react';
import { useSelector } from 'react-redux';
import { Field, formValueSelector } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { validation } from 'config';
import { default as locale } from 'locale/components';
import { FORM_NAME } from './manageAuthorConfig';

const selector = formValueSelector(FORM_NAME);

export const NameData = () => {
    const {
        editRow: {
            fields: { title, displayName, firstName, middleName, lastName, position, email },
        },
    } = locale.components.manageAuthors;
    const autEmail = useSelector(state => selector(state, 'aut_email'));

    return (
        <StandardCard subCard title="Name information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...displayName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-display-name"
                    name="aut_display_name"
                    autoFocus
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...title}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-title"
                    name="aut_title"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...firstName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-fname"
                    name="aut_fname"
                    required
                    validate={[validation.required, validation.maxLength255]}
                />
                <Field
                    {...middleName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-mname"
                    name="aut_mname"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...lastName}
                    component={AuthorFieldData}
                    name="aut_lname"
                    authorFieldDataId="aut-lname"
                    required
                    validate={[validation.required, validation.maxLength255]}
                />
                <Field
                    {...position}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-position"
                    name="aut_position"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...email}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-email"
                    name="aut_email"
                    {...(!!autEmail ? { validate: [validation.email, validation.maxLength255] } : {})}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
