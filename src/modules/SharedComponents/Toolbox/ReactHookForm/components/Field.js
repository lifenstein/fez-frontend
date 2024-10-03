import React from 'react';
import PropTypes from 'prop-types';
import Controller from './Controller';

/**
 * Validate handler that validates a value against a list of validators.
 * It returns the first error message, if any
 *
 * @param value
 * @param validate
 * @return {string|null}
 */
const validateHandler = (value, validators) => {
    if (!validators instanceof Array) {
        return null;
    }

    for (let i = 0; i < validators.length; i++) {
        if (!validators instanceof Function) {
            continue;
        }

        let result = validators[i](value);
        if (!result?.trim) {
            return null;
        }

        result = result.trim();
        if (result.length > 0) {
            return result;
        }
    }
    return null;
};

/**
 * A Higher-Order Component (HoC) inspired by the Redux Form <Field> component.
 * It utilizes a custom HoC based on the React Hook Form <Controller> component, allowing for a smoother migration
 * from Redux Form to React Hook Form.
 *
 * Similar to the original Redux Form <Field>, this component accepts an array of validators (`validate`).
 * These validators are applied to the field's value sequentially, in left-to-right order.
 *
 * @param name
 * @param control
 * @param validate
 * @param Component
 * @param childProps
 * @return {Element}
 * @constructor
 */
const Field = ({ name, control, validate, component: Component, ...childProps }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: value => validateHandler(value, validate) }}
            render={({ field }) => <Component {...field} {...childProps} />}
        />
    );
};

Field.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    validate: PropTypes.array,
    component: PropTypes.elementType.isRequired,
};

export default Field;
