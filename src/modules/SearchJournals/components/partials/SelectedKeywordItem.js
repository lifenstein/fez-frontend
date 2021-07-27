import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    chip: {
        margin: theme.spacing(1),
    },
    keyword: {
        fontWeight: 400,
    },
}));

export const SelectedKeywordItem = ({ onKeywordDelete, keyword }) => {
    const classes = useStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDeleteKeyword = React.useCallback(() => onKeywordDelete(keyword), [keyword]);

    return (
        <Chip
            className={classes.chip}
            id={`journal-search-chip-${keyword.type}-${keyword.text}`}
            data-testid={`journal-search-chip-${keyword.type}-${keyword.text}`}
            label={
                <React.Fragment>
                    <Typography variant="body2" component="span" color="secondary">
                        {`${keyword.type}: `}
                    </Typography>
                    <Typography variant="body2" component="span" className={classes.keyword}>
                        {keyword.text}
                    </Typography>
                </React.Fragment>
            }
            onDelete={handleDeleteKeyword}
        />
    );
};

SelectedKeywordItem.propTypes = {
    keyword: PropTypes.shape({
        type: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }),
    onKeywordDelete: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywordItem);
