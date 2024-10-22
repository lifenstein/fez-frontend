import { useForm as useReactHookForm } from 'react-hook-form';
import { SERVER_ERROR_KEY } from '../config/general';
import deepmerge from 'deepmerge';
import { isEmptyObject } from '../helpers/general';

export const setServerError = (setError, e) =>
    setError(SERVER_ERROR_KEY, {
        type: 'server',
        message: e.message,
        status: e.status,
        original: e.original || e,
    });

export const getServerError = errors => errors[SERVER_ERROR_KEY];

/**
 * Prevent given event default behaviour, clear server error (if any) and handles a given submit handler
 * @param attributes
 * @return {function(*): function(*): void}
 */
export const clearServerErrorAndHandleSubmit = attributes => handler => e => {
    // this is to prevent this method of being triggered twice when triggered by the form onSubmit event hook
    e.preventDefault();
    if (attributes.formState?.server?.error?.has) {
        attributes.formState.server.error.clear();
    }
    attributes.handleSubmit(handler)();
};

/**
 * Get flatten errors to a `field` => `error` object
 *
 * @param errors
 * @param otherAlreadyFlattenedErrors {{}}
 * @return {*|{}}
 */
export const flattenErrors = (errors, ...otherAlreadyFlattenedErrors) => ({
    ...Object.entries(errors).reduce((acc, [key, { message }]) => ({ ...acc, [key]: message }), {}),
    ...otherAlreadyFlattenedErrors.reduce((acc, error) => ({ ...acc, ...error }), {}),
});

/**
 * Get a subset of an object for a given set of keys
 * Returns a new object without given keys. Use inclusive=true for the opposite.
 * @param object
 * @param keys
 * @param inclusive
 * @return {{}}
 */
const filterObjectKeys = (object, keys, inclusive = false) =>
    Object.keys(object).reduce((acc, key) => {
        if ((!inclusive && !keys.includes(key)) || (inclusive && keys.includes(key))) {
            acc[key] = object[key];
        }
        return acc;
    }, {});

/**
 * @param props
 * @return {UseFormReturn<FieldValues, any, undefined>}
 */
export const useForm = props => {
    const attributes = useReactHookForm({ mode: 'onChange', ...props });

    // add isSubmitFailed attribute to formState
    attributes.formState.isSubmitFailure = attributes.formState.isSubmitted && !attributes.formState.isSubmitSuccessful;
    // add hasError attribute to formState, as isValid alone doesn't seem to take in account raised validation errors
    attributes.formState.hasError = !isEmptyObject(attributes.formState.errors);
    // add hasValidationError attribute to formState - excludes server errors
    attributes.formState.hasValidationError = !isEmptyObject(
        filterObjectKeys(attributes.formState.errors, [SERVER_ERROR_KEY]),
    );
    // add "server" namespace to formState object for managing server errors
    attributes.formState.server = {
        error: {
            has: !isEmptyObject(filterObjectKeys(attributes.formState.errors, [SERVER_ERROR_KEY], true)),
            set: e => setServerError(attributes.setError, e),
            get: () => getServerError(attributes.formState.errors),
            clear: () => attributes.clearErrors(SERVER_ERROR_KEY),
        },
    };

    // Because we store server errors in formState using setError() - to leverage RHF's state management,
    // we have to expose an alternative method to handleSubmit() that will clear these type of errors before a
    // submit retry. This is required as handleSubmit() won't trigger the submit handler if server errors are still set.
    attributes.clearServerErrorAndHandleSubmit = clearServerErrorAndHandleSubmit(attributes);

    // RHF defaultValues will ignore any values that are not related to a RHF controlled field.
    // This is a helper function to allow overriding given default values with form's current values.
    attributes.getMergedValues = defaults => deepmerge(defaults, attributes.getValues());

    return attributes;
};
