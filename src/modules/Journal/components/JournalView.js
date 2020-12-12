import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { TabbedCard } from 'modules/SharedComponents/Toolbox/TabbedCard';

import pagesLocale from 'locale/pages';
import { default as globalLocale } from 'locale/global';

const renderJournalDetail = (detail, index, sizes) =>
    detail.data &&
    (!Array.isArray(detail.data) || detail.data.length > 0) && (
        <Grid container spacing={2} alignItems="flex-start" key={index}>
            {detail.title && (
                <Grid item component="span" {...sizes.title} data-testid={`${index}-label`}>
                    <Typography component="span" variant="body2">
                        {detail.title}
                        {': '}
                    </Typography>
                </Grid>
            )}
            <Grid item component="span" {...sizes.data} data-testid={`${index}`}>
                {detail.data}
            </Grid>
        </Grid>
    );

const nodeJoin = (arr, glue) => arr.slice(1).reduce((op, item) => op.concat([glue, item]), [arr[0]]);
const titleToId = (title = '') =>
    title
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .replace(/ /g, '-');

const getBasicDetails = journalDetails => {
    const detailRows = [
        {
            title: 'ISO abbreviated title',
            data:
                (journalDetails.fez_journal_jcr_scie &&
                    journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title) ||
                (journalDetails.fez_journal_jcr_ssci &&
                    journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title) ||
                (journalDetails.fez_journal_issn &&
                    journalDetails.fez_journal_issn[0] &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_abbrev_title),
        },
        {
            title: 'ISSN(s)',
            data:
                Array.isArray(journalDetails.fez_journal_issn) &&
                journalDetails.fez_journal_issn.map(issn => issn.jnl_issn).join(', '),
        },
        {
            title: 'Publisher',
            data:
                journalDetails.jnl_publisher &&
                `${journalDetails.jnl_publisher}${journalDetails.fez_journal_issn &&
                    journalDetails.fez_journal_issn[0] &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs &&
                    journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_country &&
                    `, ${journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_country}`}`,
        },
    ];
    if (
        journalDetails.fez_journal_issn &&
        journalDetails.fez_journal_issn[0] &&
        journalDetails.fez_journal_issn[0].fez_ulrichs
    ) {
        return detailRows.concat([
            {
                title: 'Refereed',
                data: (journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_refereed && 'Yes') || 'No',
            },
            [
                {
                    title: 'First year of publication',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_start_year,
                },
                {
                    title: 'Frequency of publication',
                    data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_frequency,
                },
            ],
            {
                title: 'Journal formats available',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_formats,
            },
            {
                title: 'Journal URL',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url && (
                    <ExternalLink href={journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}>
                        {journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access_url}
                    </ExternalLink>
                ),
            },
            {
                title: 'Description',
                data: journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_description,
            },
            {
                title: 'View journal in Ulrichs',
                data: nodeJoin(
                    journalDetails.fez_journal_issn.map(
                        (issn, index) =>
                            issn.fez_ulrichs &&
                            issn.fez_ulrichs.ulr_title_id && (
                                <ExternalLink
                                    key={`journal-ulrichs-${index}-link`}
                                    href={globalLocale.global.ulrichsLink.externalUrl.replace(
                                        '[id]',
                                        issn.fez_ulrichs.ulr_title_id,
                                    )}
                                    title={globalLocale.global.ulrichsLink.ariaLabel}
                                >
                                    {issn.fez_ulrichs.ulr_title}
                                </ExternalLink>
                            ),
                    ),
                    ', ',
                ),
            },
        ]);
    }
    return detailRows;
};

const getOADetails = journalDetails => [
    {
        title: 'Open access',
        data:
            (journalDetails.fez_journal_issn &&
                journalDetails.fez_journal_issn[0] &&
                journalDetails.fez_journal_issn[0].fez_ulrichs &&
                !!journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access &&
                'Yes') ||
            'No',
    },
    {
        title: 'Article processing charges',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price &&
            `${journalDetails.fez_journal_doaj.jnl_doaj_apc_average_price} ${journalDetails.fez_journal_doaj.jnl_doaj_apc_currency}`,
    },
    {
        title: 'DOAJ seal',
        data: (journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_seal && 'Yes') || 'No',
    },
    {
        title: 'Last updated',
        data:
            journalDetails.fez_journal_doaj &&
            journalDetails.fez_journal_doaj.jnl_doaj_last_updated &&
            moment(journalDetails.fez_journal_doaj.jnl_doaj_last_updated).isValid &&
            moment(journalDetails.fez_journal_doaj.jnl_doaj_last_updated).format('Do MMMM YYYY [at] h:mma'),
    },
    {
        title: 'View in DOAJ',
        data: journalDetails.fez_journal_doaj && journalDetails.fez_journal_doaj.jnl_doaj_homepage_url && (
            <ExternalLink href={journalDetails.fez_journal_doaj.jnl_doaj_homepage_url} title={'DOAJ Homepage'}>
                {journalDetails.fez_journal_doaj.jnl_doaj_homepage_url}
            </ExternalLink>
        ),
    },
    {
        title: 'Sherpa Romeo open access and archiving policies',
        data:
            Array.isArray(journalDetails.fez_journal_issn) &&
            journalDetails.fez_journal_issn.length > 0 &&
            nodeJoin(
                journalDetails.fez_journal_issn
                    .map(
                        (issn, index) =>
                            issn.fez_sherpa_romeo &&
                            issn.fez_sherpa_romeo.srm_journal_link && (
                                <ExternalLink
                                    key={`journal-sherpa-${index}-link`}
                                    href={issn.fez_sherpa_romeo.srm_journal_link}
                                    title={globalLocale.global.sherpaRomeoLink.externalLinktext}
                                >
                                    {issn.fez_sherpa_romeo.srm_issn}
                                </ExternalLink>
                            ),
                    )
                    .filter(item => !!item),
                ', ',
            ).filter(item => !!item),
    },
];

const getSCIEdetails = journalDetails => ({
    common:
        (journalDetails.fez_journal_jcr_scie && [
            {
                title: 'Abbreviated title',
                data: journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title,
            },
            [
                {
                    title: 'Impact factor',
                    data: journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_impact_factor,
                },
                {
                    title: '5 year impact factor',
                    data: journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_5yr_impact_factor,
                },
            ],
            {
                title: 'JCR version',
                data:
                    journalDetails.fez_journal_jcr_scie &&
                    moment(journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_source_date).isValid &&
                    moment(journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_source_date).format('YYYY'),
            },
            {
                data: (
                    <ExternalLink
                        href="https://jcr-clarivate-com.ezproxy.library.uq.edu.au"
                        title="Open JCR website in a new tab"
                    >
                        Go to JCR website
                    </ExternalLink>
                ),
            },
        ]) ||
        [],
    tabs:
        (journalDetails.fez_journal_jcr_scie &&
            Array.isArray(journalDetails.fez_journal_jcr_scie.fez_journal_jcr_scie_category) &&
            journalDetails.fez_journal_jcr_scie.fez_journal_jcr_scie_category.map(category => ({
                title: category.jnl_jcr_scie_category_description,
                content: [
                    [
                        { title: 'Ranking', data: category.jnl_jcr_scie_category_ranking },
                        { title: 'Quartile', data: category.jnl_jcr_scie_category_quartile },
                    ],
                ],
            }))) ||
        [],
});

export const renderSectionContents = (details, id) =>
    details.map((detailRow, index) => {
        if (Array.isArray(detailRow)) {
            return (
                <Grid container spacing={0} alignItems="flex-start" key={`${id}-row-${index}-grid`}>
                    {detailRow.map((detailColumn, subIndex) => (
                        <Grid
                            item
                            xs={12}
                            sm
                            style={{ padding: '8px 8px 8px 0' }}
                            key={`${id}-row-${index}-column-${subIndex}-grid`}
                        >
                            {renderJournalDetail(
                                detailColumn,
                                `${id}-${titleToId(detailColumn.title) || `-row-${index}-column-${subIndex}`}`,
                                {
                                    title: { xs: 'auto' },
                                    data: { xs: 'auto' },
                                },
                            )}
                        </Grid>
                    ))}
                </Grid>
            );
        }
        return renderJournalDetail(detailRow, `${id}-${titleToId(detailRow.title) || `field-${index}`}`, {
            title: { xs: 12, sm: 6, md: 3 },
            data: { xs: 'auto' },
        });
    });

export const JournalView = ({ journalDetails, journalLoading, journalLoadingError, actions, match }) => {
    React.useEffect(() => {
        !journalDetails && !journalLoading && !journalLoadingError && actions.loadJournal(match.params.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = pagesLocale.pages.journal.view;
    if (journalLoadingError) {
        return <Alert {...txt.loadFailureAlert} />;
    } else if (journalLoading || !journalDetails) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else {
        return (
            <StandardPage standardPageId="journal-view" title={journalDetails.jnl_title || ''}>
                <StandardCard standardCardId="journal-basic-details" noHeader>
                    {renderSectionContents(getBasicDetails(journalDetails), 'journal-basic-details')}
                </StandardCard>
                <br />
                <StandardCard
                    standardCardId="journal-open-access"
                    title="Open Access (Directory of Open Access Journals - DOAJ)"
                >
                    {renderSectionContents(getOADetails(journalDetails), 'journal-open-access')}
                </StandardCard>
                <br />
                <TabbedCard
                    cardId="journal-scie"
                    cardTitle="Clarivate Journal Citation Reports - Science Citation Index"
                    {...getSCIEdetails(journalDetails)}
                    contentRenderer={renderSectionContents}
                />
                <h3>Raw API response output</h3>
                <pre>{JSON.stringify(journalDetails, null, 2)}</pre>
            </StandardPage>
        );
    }
};

JournalView.propTypes = {
    journalDetails: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    journalLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    actions: PropTypes.object,
    match: PropTypes.object,
};

export default JournalView;
