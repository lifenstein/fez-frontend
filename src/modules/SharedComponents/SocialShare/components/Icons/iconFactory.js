import React from 'react';
import PropTypes from 'prop-types';

export default function iconFactory(network, iconConfig) {
    const Icon = function Icon(props) {
        const { className, iconBgStyle, logoFillColor, borderRadius, round, size } = props;
        const baseStyle = {
            width: size,
            height: size,
        };

        const classes = 'social-icon social-icon--' + network + ' ' + className;

        return React.createElement(
            'div',
            { style: baseStyle },
            React.createElement(
                'svg',
                {
                    viewBox: '0 0 64 64',
                    width: size,
                    height: size,
                    className: classes },
                React.createElement(
                    'g',
                    null,
                    !round ? React.createElement('rect', {
                        width: '64',
                        height: '64',
                        rx: borderRadius,
                        ry: borderRadius,
                        fill: iconConfig.color,
                        style: iconBgStyle }) : React.createElement('circle', {
                        cx: '32',
                        cy: '32',
                        r: '31',
                        fill: iconConfig.color,
                        style: iconBgStyle })
                ),
                React.createElement(
                    'g',
                    null,
                    React.createElement('path', { d: iconConfig.icon, fill: logoFillColor })
                )
            )
        );
    };

    Icon.propTypes = {
        className: PropTypes.string,
        iconBgStyle: PropTypes.object,
        logoFillColor: PropTypes.string,
        round: PropTypes.bool,
        size: PropTypes.number,
        borderRadius: PropTypes.number,
    };

    Icon.defaultProps = {
        className: '',
        iconBgStyle: {},
        logoFillColor: 'white',
        size: 64,
        borderRadius: 0,
    };

    return Icon;
}
