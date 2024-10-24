import React from 'react';
import PropTypes from 'prop-types';

import makeStyles from '@mui/styles/makeStyles';

import { DOCUMENT_TYPES_LOOKUP } from 'config/general';
import { locale } from 'locale';
import { userIsAdmin } from 'hooks';

import AddFavouriteSearchIcon from './AddFavouriteSearchIcon';

const useStyles = makeStyles(
    theme => ({
        and: {
            ...theme.typography.caption,
            marginLeft: 4,
            marginRight: 4,
        },
        title: {
            ...theme.typography.caption,
            marginRight: 2,
        },
        combiner: {
            ...theme.typography.caption,
            fontStyle: 'italic',
            marginLeft: 2,
            marginRight: 2,
        },
        value: {
            ...theme.typography.caption,
            fontWeight: 'bold',
            marginLeft: 2,
        },
    }),
    { withTheme: true },
);

const getCleanValue = item => {
    // Receives an object in format {title: string, combiner: string, value: string||array}
    if (Array.isArray(item.value)) {
        const values = [...item.value];
        const lastValue = values.pop();
        return { ...item, value: values.length > 0 ? `${values.join(', ')} or ${lastValue}` : lastValue };
    }
    if (item.title === 'Any field' && item.value === '') {
        return { ...item, value: 'anything' };
    } else {
        return item;
    }
};

const getSearchFieldData = fieldRows => {
    const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
    const rows = fieldRows
        .filter(item => item.searchField !== 'rek_display_type')
        .map(item => {
            if (!!txt[item.searchField].captionFn) {
                return txt[item.searchField].captionFn(item.value);
            } else {
                return getCleanValue({
                    field: item.searchField,
                    title: txt[item.searchField].title,
                    combiner: txt[item.searchField].combiner,
                    value: item.value,
                });
            }
        });
    return rows;
};

const getDocTypeData = docTypes => {
    const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
    const converteddocTypes = docTypes.map(item => DOCUMENT_TYPES_LOOKUP[item]);
    const lastItem = converteddocTypes.pop();
    const docsString = converteddocTypes.length > 0 ? `${converteddocTypes.join(', ')} or ${lastItem}` : lastItem;
    return getCleanValue({
        field: 'rek_display_type',
        title: txt.rek_display_type.title,
        combiner: txt.rek_display_type.combiner,
        value: docsString,
    });
};

const getOpenAccessData = isOpenAccess => {
    const txt = locale.components.searchComponent.advancedSearch.openAccess;
    return isOpenAccess ? { field: 'open_access', title: '', combiner: txt.combiner, value: txt.captionText } : null;
};

const getYearFilterData = yearFilter => {
    const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
    return yearFilter.from && yearFilter.to
        ? {
              field: 'facet_year_range',
              title: txt.facet_year_range.captionTitle,
              combiner: txt.facet_year_range.combiner,
              value: `${yearFilter.from} to ${yearFilter.to}`,
          }
        : null;
};

const updateStateData = ({ fieldRows, docTypes, isOpenAccess, yearFilter }) => {
    return [
        ...getSearchFieldData(fieldRows),
        getDocTypeData(docTypes),
        getOpenAccessData(isOpenAccess),
        getYearFilterData(yearFilter),
    ];
};

export const AdvancedSearchCaption = ({ fieldRows, docTypes, yearFilter, isOpenAccess }) => {
    const classes = useStyles();
    const isUserAdmin = userIsAdmin();
    const [captionData, setCaptionData] = React.useState(
        updateStateData({ fieldRows, docTypes, yearFilter, isOpenAccess }),
    );
    React.useEffect(() => {
        setCaptionData(updateStateData({ fieldRows, docTypes, yearFilter, isOpenAccess }));
    }, [fieldRows, docTypes, yearFilter, isOpenAccess]);

    const renderCaptions = items => {
        return items
            .filter(item => item !== null) // Dont render nulls
            .filter(item => item.title !== 'Select a field') // Dont render caption for select a field
            .filter(item => !!item.value) // Dont render caption until it has a value
            .map((item, index) => {
                const fieldId = item.field.replace(/_/g, '-');
                return (
                    <span key={index} data-testid={`${fieldId}-caption`}>
                        {index !== 0 && <span className={classes.and}>{'AND'}</span>}
                        {item.title !== '' && (
                            <span
                                data-testid={`${fieldId}-caption-title`}
                                id={`${fieldId}-caption-title`}
                                className={classes.title}
                            >
                                {item.title}
                            </span>
                        )}
                        <span
                            data-testid={`${fieldId}-caption-combiner`}
                            id={`${fieldId}-caption-combiner`}
                            className={classes.combiner}
                        >
                            {item.combiner}
                        </span>
                        <span
                            data-testid={`${fieldId}-caption-value`}
                            id={`${fieldId}-caption-value`}
                            className={classes.value}
                        >
                            {item.value}
                        </span>
                    </span>
                );
            });
    };

    const captions = renderCaptions(captionData);
    return (
        <div data-testid="advanced-search-caption">
            {captions}
            {!!isUserAdmin && captions.length > 0 && <AddFavouriteSearchIcon />}
        </div>
    );
};

AdvancedSearchCaption.propTypes = {
    fieldRows: PropTypes.array,
    docTypes: PropTypes.array,
    yearFilter: PropTypes.object,
    isOpenAccess: PropTypes.bool,
};

AdvancedSearchCaption.defaultProps = {
    fieldRows: [
        {
            searchField: '0',
            value: '',
            label: '',
        },
    ],
    yearFilter: {
        from: null,
        to: null,
        invalid: true,
    },
    isOpenAccess: false,
};

export default React.memo(AdvancedSearchCaption);
