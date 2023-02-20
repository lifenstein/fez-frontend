import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { makeStyles } from '@mui//styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(
    theme => ({
        listItemGutters: {
            paddingLeft: theme.spacing(),
            paddingRight: theme.spacing(),
        },
        listText: {
            fontWeight: 400,
        },
    }),
    { withTheme: true },
);

export const FacetsFilterListItem = ({ title, disabled, nestedItems, id, isActive }) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(isActive || false);
    const handleIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    return (
        <Fragment key={`facet_fragment_${id}`}>
            <ListItem
                button
                disabled={disabled}
                id={`clickable-${id}`}
                data-testid={`clickable-${id}`}
                key={`facet_filter_${id}`}
                classes={{
                    gutters: classes.listItemGutters,
                }}
                onClick={handleIsOpen}
                aria-expanded={isOpen}
            >
                <ListItemText disableTypography>
                    <Typography
                        id={id}
                        data-testid={id}
                        variant={'body2'}
                        color={'textPrimary'}
                        className={classes.listText}
                    >
                        {title}
                    </Typography>
                </ListItemText>
                {isOpen ? (
                    <ExpandLess id={`expand-less-${id}`} data-testid={`expand-less-${id}`} />
                ) : (
                    <ExpandMore id={`expand-more-${id}`} data-testid={`expand-more-${id}`} />
                )}
            </ListItem>
            {isOpen && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    {nestedItems}
                </Collapse>
            )}
        </Fragment>
    );
};

FacetsFilterListItem.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    nestedItems: PropTypes.any,
    title: PropTypes.string,
    isActive: PropTypes.bool,
};

export default React.memo(FacetsFilterListItem);
