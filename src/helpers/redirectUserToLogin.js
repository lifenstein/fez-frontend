/* istanbul ignore file */
import { AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL } from 'config';

export const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
    const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
    const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
    window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
};
