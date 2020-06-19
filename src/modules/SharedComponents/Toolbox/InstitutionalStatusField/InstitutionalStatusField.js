import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { INSTITUTIONAL_STATUS } from 'config/general';
import Immutable from 'immutable';

export default function InstitutionalStatusField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            canUnselect
            itemsList={INSTITUTIONAL_STATUS}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={
                input instanceof Immutable.List
                    ? input.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || input || null
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-institutional-status"
            {...fieldProps}
        />
    );
}
