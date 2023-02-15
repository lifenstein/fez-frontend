/* istanbul ignore file */
import React from 'react';
import { useWidth } from 'hooks';

export const withWidth = () => WrappedComponent => props => {
    const width = useWidth();
    return <WrappedComponent {...props} width={width} />;
};
