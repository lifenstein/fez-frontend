import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import UserFieldData from './UserFieldData';

import { validation } from 'config';
import { default as locale } from 'locale/components';
import { useIsUserSuperAdmin } from 'hooks';
// import { FORM_NAME } from './manageUserConfig';

// const selector = formValueSelector(FORM_NAME);

export const NameData = () => {
    // const dispatch = useDispatch();
    const isUserSuperAdmin = useIsUserSuperAdmin();

    const {
        editRow: {
            fields: { username, fullName, email, isAdmin, isSuperAdmin },
        },
    } = locale.components.manageUsers;

    // const usrAdministrator = useSelector(state => selector(state, 'usr_administrator'));
    // const usrSuperAdministrator = useSelector(state => selector(state, 'usr_super_administrator'));

    // const handleUserAdministrator = () => {
    //     dispatch(change(FORM_NAME, 'usr_administrator', Number(!usrAdministrator)));
    // };

    // const handleUserSuperAdministrator = () => {
    //     dispatch(change(FORM_NAME, 'usr_super_administrator', Number(!usrSuperAdministrator)));
    // };

    return (
        <StandardCard subCard title="User information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-full-name"
                    name="usr_full_name"
                    required
                    autoFocus
                    validate={[validation.required, validation.maxLength255]}
                    {...fullName}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-email"
                    name="usr_email"
                    required
                    validate={[validation.required, validation.email, validation.maxLength255]}
                    {...email}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-username"
                    name="usr_username"
                    required
                    validate={[validation.required, validation.maxLength20]}
                    {...username}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-administrator"
                    name="usr_administrator"
                    type="checkbox"
                    // onChange={handleUserAdministrator}
                    {...isAdmin}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-super-administrator"
                    name="usr_super_administrator"
                    type="checkbox"
                    disabled={!isUserSuperAdmin}
                    // onChange={handleUserSuperAdministrator}
                    {...isSuperAdmin}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
