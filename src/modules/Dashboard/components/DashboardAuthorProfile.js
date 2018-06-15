import React from 'react';
import PropTypes from 'prop-types';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import {locale} from 'locale';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import DashboardArticleCount from './DashboardArticleCount';
import DashboardResearcherIds from './DashboardResearcherIds';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

const DashboardProfile = ({authorDetails, authorArticleCount, author, history}) => {
    const txt = locale.pages.dashboard.header;

    return (
        <div className="imageCover">
            {
                txt.help &&
                <div className="is-pulled-right">
                    <HelpIcon {...txt.help} />
                </div>
            }
            {
                authorDetails &&
                <div className="columns userDetails is-gapless">
                    {/* Profile avatar */}
                    {
                        authorDetails.image_exists === 1 &&
                        <div className="column is-narrow authorAvatar">
                            <DashboardAuthorAvatar
                                values={{
                                    uqr_id: authorDetails.uqr_id || author.aut_id || '',
                                    title: author.aut_title || '',
                                    givenName: author.aut_fname || '',
                                    familyName: author.aut_lname || ''
                                }}/>
                        </div>
                    }
                    {/* Author Details/Name/Orgs/ResearcherIDs */}
                    <div className="column authorDetails">
                        <DashboardAuthorDetails
                            {...{
                                title: author.aut_title || '',
                                givenName: author.aut_fname || '',
                                familyName: author.aut_lname || '',
                                orgUnits: authorDetails.org_units,
                                positions: authorDetails.positions
                            }}
                        />
                        <DashboardResearcherIds
                            values={{
                                publons: parseInt(author.aut_publons_id, 10) === 1 ? author.aut_orcid_id : author.aut_publons_id,
                                researcher: author.aut_researcher_id,
                                scopus: author.aut_scopus_id,
                                google_scholar: author.aut_google_scholar_id,
                                orcid: author.aut_orcid_id
                            }}
                            authenticated={{
                                publons: Boolean(author.aut_publons_id),
                                researcher: Boolean(author.aut_researcher_id),
                                scopus: Boolean(author.aut_is_scopus_id_authenticated),
                                google_scholar: Boolean(author.aut_google_scholar_id),
                                orcid: Boolean(author.aut_orcid_id)
                            }}
                            history={history}
                        />
                    </div>

                    {/* Publication count */}
                    {
                        authorArticleCount &&
                        <div className="column is-narrow is-hidden-tablet-only authorCount">
                            <DashboardArticleCount
                                {...{
                                    articleCount: authorArticleCount.articleCount,
                                    articleFirstYear: authorArticleCount.articleFirstYear,
                                    articleLastYear: authorArticleCount.articleLastYear,
                                }} />
                        </div>
                    }
                </div>
            }
        </div>
    );
};

DashboardProfile.propTypes = {
    authorDetails: PropTypes.object,
    authorArticleCount: PropTypes.object,
    author: PropTypes.object,
    history: PropTypes.object.isRequired
};

export default DashboardProfile;
