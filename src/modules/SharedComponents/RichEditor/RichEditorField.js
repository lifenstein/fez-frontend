import React from 'react';
import RichEditor from './components/RichEditor';

export default React.forwardRef((fieldProps, ref) => {
    return <RichEditor onChange={fieldProps.onChange} value={fieldProps.value} {...fieldProps} inputRef={ref} />;
});
