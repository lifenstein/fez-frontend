import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { makeStyles } from '@mui/styles';
import Clear from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import { sanitiseId } from 'helpers/general';

const useStyles = makeStyles(
    theme => ({
        listItemGutters: {
            paddingLeft: theme.spacing(),
            paddingRight: theme.spacing(),
        },
        listText: {
            ...theme.typography.body2,
        },
        inset: {
            '&:first-child': {
                paddingLeft: theme.spacing(2),
            },
        },
        selectedFacet: {
            color: theme.palette.primary.main,
        },
    }),
    { withTheme: true },
);

export function FacetsFilterNestedListItem({ onFacetClick, index, disabled, facet, primaryText, isActive }) {
    const classes = useStyles();
    const itemText = primaryText.indexOf('(') > 0 ? primaryText.slice(0, primaryText.indexOf('(')) : primaryText;
    const idText = sanitiseId(`${facet}-${itemText}`);
    return (
        <ListItem
            id={`facet-filter-nested-item-${idText}`}
            data-testid={`facet-filter-nested-item-${idText}`}
            key={`facet-filter-nested-item-${index}`}
            button
            onClick={onFacetClick}
            disabled={disabled}
            classes={{
                gutters: classes.listItemGutters,
            }}
            aria-label={!isActive ? `${primaryText} add filter` : `${primaryText} remove filter`}
        >
            {isActive && (
                <ListItemIcon>
                    <Clear
                        id={`clear-facet-filter-nested-item-${typeof index === 'string' ? index : idText}`}
                        data-testid={`clear-facet-filter-nested-item-${typeof index === 'string' ? index : idText}`}
                        disabled={disabled}
                    />
                </ListItemIcon>
            )}
            <ListItemText
                {...(!isActive ? { inset: true } : { inset: false })}
                className={classes.listText}
                disableTypography
                classes={{ inset: classes.inset }}
            >
                <Typography variant={'body2'} color={isActive ? 'primary' : 'inherit'}>
                    {primaryText}
                </Typography>
            </ListItemText>
        </ListItem>
    );
}

FacetsFilterNestedListItem.propTypes = {
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    facet: PropTypes.string,
    primaryText: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    onFacetClick: PropTypes.func.isRequired,
};

export default React.memo(FacetsFilterNestedListItem);
