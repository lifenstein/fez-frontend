import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { PubmedCentralLink } from 'modules/SharedComponents/PubmedCentralLink';
// eslint-disable-next-line max-len
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import locale from 'locale/viewRecord';
import { openAccessConfig } from 'config';

const styles = theme => ({
    header: {
        marginTop: 8,
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    },
    description: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    body2: {
        ...theme.typography.body2,
    },
});

export class LinksClass extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object,
    };

    LinkRow = ({ link, description, openAccessStatus }) => (
        <Grid
            container
            spacing={4}
            className={this.props.classes.header}
            alignItems={'center'}
            alignContent={'center'}
            justify={'center'}
        >
            <Grid item xs={12} sm={6}>
                <Typography variant={'body2'}>{link}</Typography>
            </Grid>
            <Grid item xs={10} sm={4} className={this.props.classes.description}>
                <Typography variant={'body2'}>{description}</Typography>
            </Grid>
            <Grid item xs={2} sm={2} style={{ textAlign: 'right' }}>
                <OpenAccessIcon {...openAccessStatus} />
            </Grid>
        </Grid>
    );

    getDOILink = (doi, openAccessStatus) => {
        if (doi.indexOf('10.14264') === -1) {
            return {
                index: 'doi',
                link: <DoiCitationView doi={doi} />,
                description: locale.viewRecord.sections.links.doiDescription,
                openAccessStatus: openAccessStatus,
            };
        } else {
            return null;
        }
    };

    getPMCLink = (pubmedCentralId, openAccessStatus) => {
        return {
            index: 'pmc',
            link: <PubmedCentralLink pubmedCentralId={pubmedCentralId} />,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    getGoogleScholarLink = (title, openAccessStatus) => {
        return {
            index: 'google',
            link: (
                <ExternalLink
                    href={locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title)}
                    title={locale.viewRecord.sections.links.googleScholar.linkDescription}
                >
                    {locale.viewRecord.sections.links.googleScholar.linkPrefix
                        .replace('[title]', title)
                        .replace('%22', '"')}
                </ExternalLink>
            ),
            description: locale.viewRecord.sections.links.googleScholar.linkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    getPublicationLink = (link, index, openAccessStatus = {}) => {
        const isRDM = !!link.rek_link.match(/^https?:\/\/[a-z0-9\-]*\.?rdm\.uq\.edu\.au/i);
        const defaultDescription = isRDM
            ? locale.viewRecord.sections.links.rdmLinkMissingDescriptionTitle
            : locale.viewRecord.sections.links.linkMissingDescriptionTitle;
        const linkDescription =
            (this.props.publication.fez_record_search_key_link_description &&
                this.props.publication.fez_record_search_key_link_description[index] &&
                this.props.publication.fez_record_search_key_link_description[index].rek_link_description) ||
            defaultDescription;
        return {
            index: index,
            link: (
                <ExternalLink href={link.rek_link} title={linkDescription}>
                    {link.rek_link}
                </ExternalLink>
            ),
            description: linkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    render() {
        const record = this.props.publication;

        const txt = locale.viewRecord.sections.links;
        const pubmedCentralId =
            record.fez_record_search_key_pubmed_central_id &&
            record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
        const doi =
            record.fez_record_search_key_doi &&
            record.fez_record_search_key_doi.rek_doi &&
            this.getDOILink(record.fez_record_search_key_doi.rek_doi)
                ? record.fez_record_search_key_doi.rek_doi
                : null;
        const openAccessStatusId =
            record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status;
        const hasLinks = record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0;

        const pmcOpenAccessStatus = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_PMC,
        };

        const gcOpenAccessStatus = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_PMC,
        };

        const doiOpenAccessStatus =
            record.calculateOpenAccess && openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_DOI
                ? record.calculateOpenAccess()
                : {};

        if (
            !(
                (record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0) ||
                (record.fez_record_search_key_pubmed_central_id &&
                    record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id) ||
                (record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi && !!doi) ||
                (record.fez_record_search_key_oa_status &&
                    record.fez_record_search_key_oa_status.rek_oa_status ===
                        openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI)
            )
        ) {
            return null;
        }
        return (
            <Grid item xs={12}>
                <StandardCard title={txt.title}>
                    <Hidden xsDown>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            className={this.props.classes.header}
                        >
                            <Grid item sm={6}>
                                <Typography variant="caption" gutterBottom>
                                    {txt.headerTitles.link}
                                </Typography>
                            </Grid>
                            <Grid item sm={4}>
                                <Typography variant="caption" gutterBottom>
                                    {txt.headerTitles.description}
                                </Typography>
                            </Grid>
                            <Grid item sm={2}>
                                <Typography variant="caption" gutterBottom>
                                    {txt.headerTitles.oaStatus}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Hidden>
                    {// if record has a PubMedCentral Id - display link, should be always OA
                    // prettier-ignore
                        !!pubmedCentralId &&
                        <this.LinkRow {...this.getPMCLink(pubmedCentralId, pmcOpenAccessStatus)} />}
                    {// if record has a DOI - display a link, should be OA or OA with a date
                        !!doi && <this.LinkRow {...this.getDOILink(doi, doiOpenAccessStatus)} />}
                    {// record has OA status of "Link (no DOI)" then produce a google
                    // scholar link for the publication title
                        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI && (
                            <this.LinkRow {...this.getGoogleScholarLink(record.rek_title, gcOpenAccessStatus)} />
                        )}
                    {hasLinks &&
                        record.fez_record_search_key_link.map((item, index) => (
                            <this.LinkRow {...this.getPublicationLink(item, index)} key={index} />
                        ))}
                </StandardCard>
            </Grid>
        );
    }
}

const StyledLinksClass = withStyles(styles, { withTheme: true })(LinksClass);
const Links = props => <StyledLinksClass {...props} />;
export default Links;
