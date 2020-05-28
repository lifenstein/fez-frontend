import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { UNPUBLISHED_STATUS } from 'config/general';

export const mapStateToProps = (state, props) => {
    return {
        value: props.input ? props.input.value : props.value,
        itemsList: props.itemsList || UNPUBLISHED_STATUS,
        itemsLoading: false,
        hideLabel: props.hideLabel || false,
        label: props.label,
        placeholder: props.placeholder,
        required: props.required,
        errorText: (!!props.meta && props.meta.error) || (props.error && !!props.errorText) || '',
        error: (!!props.meta && !!props.meta.error) || props.error || false,
        genericSelectFieldId: 'rek-status',
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        onChange: (!!props.input && props.input.onChange) || (!!props.onChange && props.onChange),
    };
};

export const UnpublishedStatusField = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);
