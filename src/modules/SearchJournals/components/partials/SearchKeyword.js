import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.accent.main,
        cursor: 'pointer',
    },
    default: {},
    addable: {
        '&::before': {
            content: '"+"',
            marginRight: '4px',
        },
    },
}));

export const SearchKeyword = ({ keyword, onKeywordClick, variant }) => {
    const classes = useStyles();
    const handleKeywordClick = () => onKeywordClick(keyword);

    return (
        <Typography
            variant="body2"
            classes={{ root: classes.root }}
            className={classes[variant || 'default']}
            onClick={handleKeywordClick}
        >
            {keyword}
        </Typography>
    );
};

SearchKeyword.propTypes = {
    keyword: PropTypes.string.isRequired,
    onKeywordClick: PropTypes.func,
    variant: PropTypes.oneOf(['default', 'addable']),
};

export default React.memo(SearchKeyword);
