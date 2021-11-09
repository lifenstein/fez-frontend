import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import FacetFilterListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterListItem';
import FacetFilterNestedListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterNestedListItem';
import locale from 'locale/components';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { useJournalSearch } from '../hooks';

export const JournalFacetFilterNestedListItemsList = React.memo(function FacetFilterNestedListItemsList({
    facetCategory,
    disabled,
    activeFacets,
    handleFacetClick,
    isFacetFilterActive,
}) {
    return facetCategory.facets.map((item, index) => {
        const isActive = isFacetFilterActive(activeFacets.filters, facetCategory.facetTitle, item.key);
        return (
            <FacetFilterNestedListItem
                key={index}
                index={index}
                onFacetClick={handleFacetClick(facetCategory.facetTitle, item.key)}
                isActive={isActive}
                primaryText={item.count ? `${item.title} (${item.count})` : `${item.title}`}
                disabled={disabled}
            />
        );
    });
});

JournalFacetFilterNestedListItemsList.propTypes = {
    facetCategory: PropTypes.object,
    disabled: PropTypes.bool,
    activeFacets: PropTypes.object,
    handleFacetClick: PropTypes.func,
    isFacetFilterActive: PropTypes.func,
};

export const showFavouritedOnlyFacet = {
    title: 'Favourite Journals',
    facetTitle: 'ShowFavouritedOnly',
    facets: [
        {
            title: 'Show journals favourited',
            key: 'ShowFavouritedOnly',
        },
    ],
};

export const getFacetsToDisplay = (rawFacets, renameFacetsList) => {
    const facetsToDisplay = [];
    Object.keys(rawFacets).forEach(key => {
        const rawFacet = rawFacets[key];
        // construct facet object to display, if facet has a lookup - get display name from lookup,
        // if facet key has a rename record, then use that.
        // Note use of Number.isFinite - will convert any *actual* numeric values to string
        const facetToDisplay = {
            title: renameFacetsList[key] || key,
            facetTitle: key,
            facets: rawFacet.buckets.map(item => {
                return {
                    title: key.endsWith('quartile') ? `Q${item.key}` : item.key,
                    key: Number.isFinite(item.key) ? String(item.key) : item.key,
                    count: item.doc_count,
                };
            }),
        };

        facetsToDisplay.push(facetToDisplay);
    });

    // add show favourite only facet
    facetsToDisplay.push(showFavouritedOnlyFacet);
    return facetsToDisplay;
};

const isFacetFilterActive = (activeFacetsFilters, category, value) => {
    if (activeFacetsFilters.hasOwnProperty(category)) {
        return (
            (Array.isArray(activeFacetsFilters[category]) && activeFacetsFilters[category].includes(value)) ||
            category === showFavouritedOnlyFacet.facetTitle
        );
    }
    return false;
};

export const JournalSearchFacetsFilter = ({ facetsData, renameFacetsList, disabled, onFacetsChanged }) => {
    const { journalSearchQueryParams } = useJournalSearch();
    const activeFiltersQuerystringPart = JSON.stringify(journalSearchQueryParams.activeFacets?.filters);
    const prevActiveFiltersQuerystringPart = useRef(activeFiltersQuerystringPart);
    const keywordsQuerystringPart = JSON.stringify(journalSearchQueryParams.keywords);
    const prevKeywordsQuerystringPart = useRef(keywordsQuerystringPart);
    const [isFacetFilterClicked, setIsFacetFilterClicked] = useState(false);
    const [activeFacetsFilters, setActiveFacetsFilters] = useState({
        ...journalSearchQueryParams.activeFacets?.filters,
    });
    const [activeFacetsRanges] = useState({ ...journalSearchQueryParams.activeFacets?.ranges });

    /**
     * This effect takes care of making the facets filter UI reflect updates made to the activeFacets part
     * of the querystring.
     *
     * The reason why using useState above is not enough can be found
     * in here https://stackoverflow.com/a/58877875/1463121
     */
    useEffect(() => {
        if (activeFiltersQuerystringPart === prevActiveFiltersQuerystringPart.current) {
            return;
        }

        setActiveFacetsFilters({ ...journalSearchQueryParams.activeFacets?.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFiltersQuerystringPart]);

    /**
     * This effect takes care of resetting the facets filter whenever a keyword is removed
     */
    useEffect(() => {
        if (keywordsQuerystringPart === prevKeywordsQuerystringPart.current) {
            return;
        }

        setActiveFacetsFilters({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywordsQuerystringPart]);

    useEffect(() => {
        if (isFacetFilterClicked) {
            onFacetsChanged({
                filters: activeFacetsFilters,
                ranges: activeFacetsRanges,
            });
        }

        return () => setIsFacetFilterClicked(false);
    }, [isFacetFilterClicked, activeFacetsFilters, activeFacetsRanges, onFacetsChanged]);

    const facetsToDisplay = getFacetsToDisplay(facetsData, renameFacetsList);

    const _handleFacetClick = (category, facet) => () => {
        const newActiveFacetsFilters = { ...activeFacetsFilters };
        if (isFacetFilterActive(newActiveFacetsFilters, category, facet)) {
            if (category === showFavouritedOnlyFacet.facetTitle) {
                delete newActiveFacetsFilters[category];
            } else {
                newActiveFacetsFilters[category] = newActiveFacetsFilters[category].filter(item => item !== facet);
            }
        } else if (newActiveFacetsFilters.hasOwnProperty(category)) {
            newActiveFacetsFilters[category].push(facet);
        } else {
            newActiveFacetsFilters[category] = category === showFavouritedOnlyFacet.facetTitle ? true : [facet];
        }

        setIsFacetFilterClicked(true);
        setActiveFacetsFilters(newActiveFacetsFilters);
    };

    return (
        <StandardRighthandCard
            title={locale.components.searchJournals.journalFacetsFilter.title}
            help={locale.components.searchJournals.journalFacetsFilter.help}
        >
            <div className="facetsFilter" id="facets-filter" data-testid="facets-filter">
                <List component="nav" dense>
                    {facetsToDisplay.map(item => {
                        return (
                            <FacetFilterListItem
                                id={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                                key={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                                title={item.title}
                                disabled={disabled}
                                isActive={activeFacetsFilters.hasOwnProperty(item.facetTitle)}
                                nestedItems={
                                    <JournalFacetFilterNestedListItemsList
                                        facetCategory={item}
                                        disabled={disabled}
                                        activeFacets={{
                                            filters: activeFacetsFilters,
                                            ranges: activeFacetsRanges,
                                        }}
                                        handleFacetClick={_handleFacetClick}
                                        isFacetFilterActive={isFacetFilterActive}
                                    />
                                }
                            />
                        );
                    })}
                </List>
            </div>
        </StandardRighthandCard>
    );
};

JournalSearchFacetsFilter.propTypes = {
    facetsData: PropTypes.object,
    initialFacets: PropTypes.object,
    renameFacetsList: PropTypes.object,
    disabled: PropTypes.bool,
    showFavouritedFilter: PropTypes.bool,
    onFacetsChanged: PropTypes.func,
};

JournalSearchFacetsFilter.defaultProps = {
    renameFacetsList: {},
    showFavouritedFilter: false,
};

export default React.memo(JournalSearchFacetsFilter);
