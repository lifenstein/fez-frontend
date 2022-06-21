import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { locale } from 'locale';
import { publicationTypes, pathConfig } from 'config';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

// citations for different publication types
import AdminActions from './citations/partials/AdminActions';
import AudioDocumentCitation from './citations/AudioDocumentCitation';
import BookChapterCitation from './citations/BookChapterCitation';
import BookCitation from './citations/BookCitation';
import CitationCounts from './citations/CitationCounts';
import ConferencePaperCitation from './citations/ConferencePaperCitation';
import ConferenceProceedingsCitation from './citations/ConferenceProceedingsCitation';
import CreativeWorkCitation from './citations/CreativeWorkCitation';
import DataCollectionCitation from './citations/DataCollectionCitation';
import DepartmentTechnicalReportCitation from './citations/DepartmentTechnicalReportCitation';
import DesignCitation from './citations/DesignCitation';
import DigilibImageCitation from './citations/DigilibImageCitation';
import GenericDocumentCitation from './citations/GenericDocumentCitation';
import ImageDocumentCitation from './citations/ImageDocumentCitation';
import JournalArticleCitation from './citations/JournalArticleCitation';
import JournalCitation from './citations/JournalCitation';
import ManuscriptCitation from './citations/ManuscriptCitation';
import NewspaperArticleCitation from './citations/NewspaperArticleCitation';
import PatentCitation from './citations/PatentCitation';
import PreprintCitation from './citations/PreprintCitation';
import ResearchReportCitation from './citations/ResearchReportCitation';
import SeminarPaperCitation from './citations/SeminarPaperCitation';
import ThesisCitation from './citations/ThesisCitation';
import VideoDocumentCitation from './citations/VideoDocumentCitation';
import WorkingPaperCitation from './citations/WorkingPaperCitation';
import { UnpublishedBufferCitationView } from './citations/partials/UnpublishedBufferCitationView';

export const styles = theme => ({
    divider: {
        marginBottom: 12,
        marginTop: 12,
    },
    citationTitle: {
        overflowWrap: 'break-word !important',
        lineHeight: 1,
        letterSpacing: 0,
        marginBottom: 6,
        marginRight: 12,
    },
    citationText: {
        ...theme.typography.caption,
        color: theme.typography.body2.color,
        marginBottom: 6,
    },
    citationCounts: {
        whiteSpace: 'nowrap',
    },
    buttonMargin: {
        [theme.breakpoints.down('sm')]: {
            marginTop: 12,
        },
    },
    contentIndicatorTitle: {
        fontWeight: 400,
        marginRight: '0.5ex',
    },
});

export class PublicationCitation extends PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        citationStyle: PropTypes.string,
        className: PropTypes.string,
        classes: PropTypes.object,
        customActions: PropTypes.array,
        hideCitationCounts: PropTypes.bool,
        hideCitationText: PropTypes.bool,
        hideContentIndicators: PropTypes.bool,
        hideCountDiff: PropTypes.bool,
        hideCountTotal: PropTypes.bool,
        hideLinks: PropTypes.bool,
        hideTitle: PropTypes.bool,
        hideViewFullStatisticsLink: PropTypes.bool,
        history: PropTypes.object.isRequired,
        location: PropTypes.object,
        publication: PropTypes.object.isRequired,
        publicationsLoading: PropTypes.bool,
        isPublicationDeleted: PropTypes.bool,
        showAdminActions: PropTypes.bool,
        showDefaultActions: PropTypes.bool,
        showMetrics: PropTypes.bool,
        showSourceCountIcon: PropTypes.bool,
        showSources: PropTypes.bool,
        showUnpublishedBufferFields: PropTypes.bool,
    };

    static defaultProps = {
        citationStyle: 'notset',
        className: '',
        hideCitationCounts: false,
        hideCitationText: false,
        hideContentIndicators: false,
        hideCountDiff: false,
        hideCountTotal: false,
        hideLinks: false,
        hideTitle: false,
        hideViewFullStatisticsLink: false,
        showAdminActions: false,
        showDefaultActions: false,
        showSourceCountIcon: false,
        showSources: false,
        showUnpublishedBufferFields: false,
        isPublicationDeleted: false,
    };

    constructor(props) {
        super(props);
        // keep a list of all available citations
        this.citationComponents = {
            AudioDocumentCitation,
            BookChapterCitation,
            BookCitation,
            ConferencePaperCitation,
            ConferenceProceedingsCitation,
            CreativeWorkCitation,
            DataCollectionCitation,
            DepartmentTechnicalReportCitation,
            DesignCitation,
            DigilibImageCitation,
            GenericDocumentCitation,
            ImageDocumentCitation,
            JournalArticleCitation,
            JournalCitation,
            ManuscriptCitation,
            NewspaperArticleCitation,
            PatentCitation,
            PreprintCitation,
            ResearchReportCitation,
            SeminarPaperCitation,
            ThesisCitation,
            VideoDocumentCitation,
            WorkingPaperCitation,
        };

        // get default actions from locale
        this.defaultActions = locale.components.publicationCitation.defaultActions;
    }

    _handleDefaultActions = action => {
        const { history, publication } = this.props;
        switch (action) {
            case 'fixRecord':
                history.push(pathConfig.records.fix(publication.rek_pid));
                break;
            case 'shareRecord':
                // TODO: display share interface
                break;
            default:
                // do nothing
                break;
        }
    };

    renderTitle = () => {
        const { publication, hideLinks } = this.props;
        return publication.rek_pid && !hideLinks ? (
            <Link to={pathConfig.records.view(publication.rek_pid)}>{ReactHtmlParser(publication.rek_title)}</Link>
        ) : (
            ReactHtmlParser(publication.rek_title)
        );
    };

    renderCitation = publicationTypeId => {
        const { publication, hideLinks, citationStyle } = this.props;
        const filteredPublicationType = publicationTypeId
            ? publicationTypes(this.citationComponents)[publicationTypeId]
            : null;

        return (filteredPublicationType || {}).citationComponent ? (
            React.createElement(filteredPublicationType.citationComponent, {
                publication: publication,
                hideDoiLink: hideLinks,
                citationStyle: citationStyle,
            })
        ) : (
            <div>Citation display not available for {publicationTypeId}</div>
        );
    };

    renderActions = actions => {
        const { publication, showDefaultActions, publicationsLoading } = this.props;
        const pid = publication && publication.rek_pid && publication.rek_pid.replace(':', '');
        const primaryButtonDisabled =
            !publication.rek_pid &&
            !publication.fez_record_search_key_author &&
            !publication.fez_record_search_key_author_id &&
            !publication.fez_record_search_key_contributor &&
            !publication.fez_record_search_key_contributor_id;

        return actions && actions.length > 0
            ? actions.map((action, index) => {
                  const testId = `publication-action-${pid}`;
                  const buttonProps = {
                      color: 'primary',
                      fullWidth: true,
                      disabled: action.disabled,
                      children: action.label,
                      className: `publicationAction buttonOrder${index}`,
                      onClick: () =>
                          showDefaultActions
                              ? this._handleDefaultActions(action.key)
                              : action.handleAction(publication),
                  };
                  return (
                      <Grid item xs={12} sm="auto" key={`action_key_${index}`}>
                          {action.primary ? (
                              <Button
                                  {...buttonProps}
                                  disabled={!!publicationsLoading || primaryButtonDisabled}
                                  classes={{ label: pid, root: pid }}
                                  variant="contained"
                                  data-testid={`${testId}-primary`}
                              >
                                  {action.label}
                                  {!!publicationsLoading && (
                                      <CircularProgress
                                          size={12}
                                          style={{ marginLeft: 12, marginTop: -2 }}
                                          thickness={3}
                                          color={'secondary'}
                                          variant={'indeterminate'}
                                          aria-label="Waiting for records to finish loading"
                                      />
                                  )}
                              </Button>
                          ) : (
                              <Button
                                  disabled={!!publicationsLoading}
                                  classes={{ label: pid, root: pid }}
                                  variant="text"
                                  {...buttonProps}
                                  data-testid={`${testId}-secondary`}
                              >
                                  {action.label}
                                  {!!publicationsLoading && (
                                      <CircularProgress
                                          size={12}
                                          style={{ marginLeft: 12, marginTop: -2 }}
                                          thickness={3}
                                          color={'secondary'}
                                          variant={'indeterminate'}
                                          aria-label="Waiting for records to finish loading"
                                      />
                                  )}
                              </Button>
                          )}
                      </Grid>
                  );
              })
            : null;
    };

    renderSources = () => {
        const { publication } = this.props;
        return (
            <React.Fragment>
                {locale.components.publicationCitation.publicationSourcesLabel}
                {publication.sources.map((source, index) => {
                    const sourceConfig = locale.global.sources[source.source];
                    return (
                        <ExternalLink
                            id={`publication-source-${source.source}`}
                            key={'source_' + index}
                            className="publicationSource"
                            href={sourceConfig.externalUrl.replace('[id]', source.id)}
                            aria-label={locale.global.linkWillOpenInNewWindow.replace(
                                '[destination]',
                                sourceConfig.title,
                            )}
                        >
                            {sourceConfig.title}
                        </ExternalLink>
                    );
                })}
            </React.Fragment>
        );
    };

    render() {
        const {
            classes,
            customActions,
            hideCitationCounts,
            hideCitationText,
            hideContentIndicators,
            hideCountDiff,
            hideCountTotal,
            hideTitle,
            hideViewFullStatisticsLink,
            location,
            publication,
            showAdminActions,
            showDefaultActions,
            showMetrics,
            showSourceCountIcon,
            showSources,
            showUnpublishedBufferFields,
            isPublicationDeleted,
        } = this.props;
        const txt = locale.components.publicationCitation;
        const recordValue = showMetrics && publication.metricData;
        return (
            <div className="publicationCitation">
                <Grid container spacing={0}>
                    <Grid item xs>
                        <Grid container spacing={0}>
                            {!hideTitle ? (
                                <Grid item xs style={{ minWidth: 1 }}>
                                    <Typography variant="h6" component="h6" className={classes.citationTitle}>
                                        {this.renderTitle()}
                                    </Typography>
                                </Grid>
                            ) : (
                                <Grid item xs />
                            )}
                            {showMetrics && (
                                <Grid item xs={12} sm="auto" className="citationMetrics">
                                    <ExternalLink
                                        id={`my-trending-pubs-${recordValue.source}`}
                                        href={recordValue.citation_url}
                                        title={txt.linkWillOpenInNewWindow.replace(
                                            '[destination]',
                                            txt.myTrendingPublications.sourceTitles[recordValue.source],
                                        )}
                                        aria-label={txt.linkWillOpenInNewWindow.replace(
                                            '[destination]',
                                            txt.myTrendingPublications.sourceTitles[recordValue.source],
                                        )}
                                        openInNewIcon={false}
                                    >
                                        <Grid container>
                                            {showSourceCountIcon && (
                                                <Grid item>
                                                    <span className={`fez-icon ${recordValue.source} xxxlarge`} />
                                                    <Typography variant="h6">{recordValue.count}</Typography>
                                                </Grid>
                                            )}
                                            {!showSourceCountIcon && !hideCountTotal && (
                                                <Grid item>
                                                    <Typography variant="h6" color="inherit" className="count">
                                                        {Math.round(recordValue.count)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {!hideCountDiff && (
                                                <Grid item>
                                                    <Typography
                                                        variant="h6"
                                                        color="inherit"
                                                        className="difference"
                                                        title={
                                                            txt.myTrendingPublications.trendDifferenceShares[
                                                                recordValue.source
                                                            ]
                                                        }
                                                    >
                                                        +{Math.round(recordValue.difference)}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </ExternalLink>
                                </Grid>
                            )}
                            {!hideCitationText && (
                                <Grid item xs={12} className={classes.citationText}>
                                    {this.renderCitation(publication.rek_display_type)}
                                </Grid>
                            )}
                            {showUnpublishedBufferFields && (
                                <Grid item xs={12}>
                                    <UnpublishedBufferCitationView publication={publication} />
                                </Grid>
                            )}
                            {(!hideCitationCounts || !!showAdminActions) && (
                                <Grid item xs={12}>
                                    <Grid container alignItems="center">
                                        {!hideCitationCounts && (
                                            <Grid
                                                item
                                                xs="auto"
                                                className={classes.citationCounts}
                                                style={{ flexGrow: 1 }}
                                            >
                                                <CitationCounts
                                                    publication={publication}
                                                    hideViewFullStatisticsLink={hideViewFullStatisticsLink}
                                                />
                                            </Grid>
                                        )}
                                        {!!showAdminActions && (
                                            <Grid item>
                                                <AdminActions
                                                    publication={publication}
                                                    isRecordDeleted={isPublicationDeleted}
                                                    navigatedFrom={
                                                        (location.hash && location.hash.replace('#', '')) ||
                                                        `${location.pathname}${location.search}`
                                                    }
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                            {showSources && publication.sources && (
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="caption">
                                        {this.renderSources()}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    {!hideContentIndicators &&
                        publication.fez_record_search_key_content_indicator &&
                        publication.fez_record_search_key_content_indicator.length > 0 && (
                            <Grid item xs={12}>
                                <Typography
                                    variant="caption"
                                    id="rek-content-indicator"
                                    data-testid="rek-content-indicator"
                                >
                                    <span className={classes.contentIndicatorTitle}>
                                        {locale.components.contentIndicators.label}:
                                    </span>
                                    {publication.fez_record_search_key_content_indicator
                                        .map(item => item.rek_content_indicator_lookup)
                                        .join(locale.components.contentIndicators.divider)}
                                </Typography>
                            </Grid>
                        )}
                </Grid>
                {(showDefaultActions || customActions) && (
                    <Grid container spacing={1} className={classes.buttonMargin}>
                        <Hidden xsDown>
                            <Grid item xs />
                        </Hidden>
                        {this.renderActions(showDefaultActions ? this.defaultActions : customActions)}
                    </Grid>
                )}
                <Divider className={classes.divider} />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(PublicationCitation);
