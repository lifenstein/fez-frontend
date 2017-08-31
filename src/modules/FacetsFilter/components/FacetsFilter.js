import React from 'react';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/RaisedButton';

class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        loadingFacetsData: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            activeFacets: {},
            activeCategories: {}
        };

        this.handleActiveLinkClick = this.handleActiveLinkClick.bind(this);
        this.handleActiveCategoryClick = this.handleActiveCategoryClick.bind(this);
        this.handleClearAllClick = this.handleClearAllClick.bind(this);
    }

    // This handles when you click on a facet
    handleActiveLinkClick(e) {
        e.preventDefault();

        const activeFacets = {...this.state.activeFacets};
        const facet = e.target.dataset.facet;
        const category = e.target.dataset.category;

        if (activeFacets[category] !== undefined) {
            if (activeFacets[category].includes(facet)) {
                activeFacets[category] = activeFacets[category].filter(item => {
                    return item !== facet;
                });
                if (activeFacets[category].length === 0) {
                    delete activeFacets[category];
                }
            } else {
                activeFacets[category].push(facet);
            }
        } else {
            activeFacets[category] = [facet];
        }

        this.setState({
            activeFacets: activeFacets,
        }, () => {
            console.log('Current state of activeFacets: ' +
                JSON.stringify(this.state.activeFacets));
        });

        // Below is example of dispatching the new data to the API to re-render
        // this.props.actions.searchAuthors(newValue, (item) => { return !!item.aut_org_username; });
    }

    // This just handles the accordion css style showing the facets list on a click
    handleActiveCategoryClick(e) {
        e.preventDefault();

        const activeCategories = {...this.state.activeCategories};
        const category = e.target.dataset.category;
        if (activeCategories[category] !== undefined) {
            if (activeCategories[category].includes('active')) {
                delete activeCategories[category];
            } else {
                activeCategories[category] = ['active'];
            }
        } else {
            activeCategories[category] = ['active'];
        }
        this.setState({
            activeCategories: activeCategories,
        });
    }

    // Click handler to clear all the active facets
    handleClearAllClick(e) {
        e.preventDefault();
        // Clear the array!
        this.setState({
            activeFacets: {},
            activeCategories: {},
        });
    }

    render() {
        const txt = locale.components.facetsFilter;

        const aggregations = [];
        const facetsData = this.props.facetsData;

        // if (!facetsData) return (<div />); why?

        Object.keys(facetsData).filter(key => key.indexOf('(lookup)') === -1 && facetsData[key].buckets.length !== 0).forEach(key => {
            const o = facetsData[key];
            // Assign a lookup key
            const lookupItem = facetsData[`${key} (lookup)`] || o;
            // Push the new data into a new object
            aggregations.push({
                aggregation: key,
                display_name: o.display_name,
                facets: o.buckets.map((bucket, index) => {
                    bucket.display_name = lookupItem.buckets[index].key;
                    return bucket;
                }),
            });
        });

        const sortedAggregations = aggregations.sort((a, b) => {
            return a.doc_count > b.doc_count ? -1 : 1;
        });

        return (
            <div className="facetsFilter">
                <div
                    className="columns is-gapless is-marginless is-paddingless facetsTitle">
                    <div className="column">
                        <h3 className="title is-5">{txt.title}</h3>
                    </div>
                    <div className="column is-narrow is-helpicon">
                        <HelpIcon
                            title={txt.help.title}
                            text={txt.help.text}
                            buttonLabel={txt.help.button}
                        />
                    </div>
                </div>
                <div className="facetsList body-2">
                    {sortedAggregations.map((item, index) => (
                        <div key={index}>
                            <div className="facetsCategory">
                                <div className="facetsCategoryTitle"
                                    data-category={item.aggregation}
                                    tabIndex="0"
                                    onClick={this.handleActiveCategoryClick}
                                    onKeyPress={this.handleActiveCategoryClick}>
                                    {item.aggregation}
                                </div>
                                <div
                                    className={this.state.activeCategories[item.aggregation]
                                        ? 'facetLinksList active'
                                        : 'facetLinksList'}>
                                    {item.facets.map((subitem, subindex) => (
                                        <div key={subindex}
                                            tabIndex={this.state.activeCategories[item.aggregation] ? 0 : -1}
                                            className={this.state.activeFacets[item.aggregation] &&
                                             this.state.activeFacets[item.aggregation].includes('' +
                                                 subitem.key)
                                                ? 'facetListItems active'
                                                : 'facetListItems'}
                                            id="test"
                                            onClick={this.handleActiveLinkClick}
                                            onKeyPress={this.handleActiveLinkClick}
                                            data-facet={subitem.key}
                                            data-category={item.aggregation}>
                                            {subitem.display_name} ({subitem.doc_count})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div>
                        <FlatButton
                            className="is-pulled-right"
                            label="Clear all"
                            onClick={this.handleClearAllClick}/>
                    </div>
                </div>
                {/* Just for testing purposes */}
                {window.location.href.indexOf('localhost') >= 1 &&
                <div style={{marginTop: 100}}>
                    Active Facets:<br />{JSON.stringify(this.state.activeFacets)}
                    <br /><br />
                    Active Categories:<br />{JSON.stringify(this.state.activeCategories)}
                </div>
                }
            </div>
        );
    }
}

export default FacetsFilter;
