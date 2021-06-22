import globalLocale from 'locale/global';
import moment from 'moment';

export const journalViewConfig = {
    basic: {
        rows: [
            [
                {
                    heading: 'ISO abbreviated title',
                    fieldId: 'ulr-abbrev-title',
                    getData: journalDetails =>
                        (!!journalDetails.fez_journal_jcr_scie &&
                            !!journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title &&
                            journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title) ||
                        (!!journalDetails.fez_journal_jcr_ssci &&
                            !!journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title &&
                            journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title) ||
                        (!!journalDetails.fez_journal_issn &&
                            !!journalDetails.fez_journal_issn.length > 0 &&
                            journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_abbrev_title),
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'ISSN(s)',
                    fieldId: 'jnl-issn',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_issn',
                            path: ['jnl_issn'],
                            filterFn: issn => issn.jnl_issn_type !== 454151,
                        },
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item => item,
                    },
                },
            ],
            [
                {
                    heading: 'eISSN(s)',
                    fieldId: 'jnl-issn-454151',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_issn',
                            path: ['jnl_issn'],
                            filterFn: issn => issn.jnl_issn_type === 454151,
                        },
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item => item,
                    },
                },
            ],
            [
                {
                    heading: 'Publisher',
                    fieldId: 'jnl-publisher',
                    mergeData: true,
                    separator: ', ',
                    data: [
                        {
                            path: ['jnl_publisher'],
                        },
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_country'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Refereed',
                    fieldId: 'ulr-refereed',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_refereed'],
                        },
                    ],
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'First year of publication',
                    fieldId: 'ulr-start-year',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_start_year'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Frequency of publication',
                    fieldId: 'ulr-frequency',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_frequency'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Journal formats available',
                    fieldId: 'ulr-formats',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_formats'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Journal URL',
                    fieldId: 'ulr-open-access-url',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_open_access_url'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'Description',
                    fieldId: 'ulr-description',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_description'],
                        },
                    ],
                    template: 'DefaultTemplate',
                },
            ],
            [
                {
                    heading: 'View journal in Ulrichs',
                    fieldId: 'ulr-title',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_issn',
                            filterFn: issn => !!issn.fez_ulrichs && !!issn.fez_ulrichs.ulr_title_id,
                            path: ['fez_ulrichs'],
                        },
                    ],
                    template: 'MultiLinkTemplate',
                    templateProps: {
                        href: item => globalLocale.global.ulrichsLink.externalUrl.replace('[id]', item.ulr_title_id),
                        text: item => item.ulr_title,
                        title: 'View Ulrichs details in a new tab',
                    },
                },
            ],
        ],
    },
    doaj: {
        key: 'fez_journal_doaj',
        title: 'Open Access (Directory of Open Access Journals - DOAJ)',
        rows: [
            [
                {
                    heading: 'Open access',
                    fieldId: 'ulr-open-access',
                    data: [
                        {
                            path: ['fez_journal_issn', 0, 'fez_ulrichs', 'ulr_open_access'],
                        },
                    ],
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'Journal home page',
                    fieldId: 'jnl-doaj-homepage-url',
                    data: [
                        {
                            path: ['fez_journal_doaj', 'jnl_doaj_homepage_url'],
                        },
                    ],
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item => item,
                        text: item => item,
                        title: 'View journal home page in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'Article processing charges',
                    fieldId: 'jnl-doaj-apc-average-price',
                    mergeData: true,
                    separator: ' ',
                    data: [
                        {
                            path: ['fez_journal_doaj', 'jnl_doaj_apc_average_price'],
                        },
                        {
                            path: ['fez_journal_doaj', 'jnl_doaj_apc_currency'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Journal licence',
                    fieldId: 'jnl-doaj-by-sa-nd-nc',
                    getData: journalDetails => ({
                        by: !!journalDetails.fez_journal_doaj.jnl_doaj_by,
                        sa: !!journalDetails.fez_journal_doaj.jnl_doaj_sa,
                        nd: !!journalDetails.fez_journal_doaj.jnl_doaj_nd,
                        nc: !!journalDetails.fez_journal_doaj.jnl_doaj_nc,
                    }),
                    template: 'CreativeCommonsLicenceTemplate',
                },
            ],
            [
                {
                    heading: 'DOAJ seal',
                    fieldId: 'jnl-doaj-seal',
                    data: [
                        {
                            path: ['fez_journal_doaj', 'jnl_doaj_seal'],
                        },
                    ],
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'Last updated',
                    fieldId: 'jnl-doaj-last-updated',
                    data: [
                        {
                            path: ['fez_journal_doaj', 'jnl_doaj_last_updated'],
                        },
                    ],
                    template: 'DateTimeTemplate',
                    templateProps: {
                        format: 'Do MMMM YYYY [at] h:mma',
                    },
                },
            ],
            [
                {
                    heading: 'View in DOAJ',
                    fieldId: 'ulr-open-access-jnl-issn',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_issn &&
                        journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_open_access === '1' &&
                        journalDetails.fez_journal_issn[0].jnl_issn,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item => `https://doaj.org/toc/${item}`,
                        title: 'View journal details in DOAJ',
                        text: item => item,
                    },
                },
            ],
            [
                {
                    heading: 'Sherpa Romeo open access and archiving policies',
                    fieldId: 'srm-journal-link',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_issn',
                            path: ['fez_sherpa_romeo'],
                            filterFn: item => !!item.fez_sherpa_romeo,
                        },
                    ],
                    template: 'MultiLinkTemplate',
                    templateProps: {
                        href: item => item.srm_journal_link,
                        title: 'View SHERPA/RoMEO details in a new tab',
                        text: item => item.srm_issn,
                    },
                },
            ],
        ],
    },
    jscie: {
        key: 'fez_journal_jcr_scie',
        title: 'Clarivate Journal Citation Reports - Science Citation Index',
        rows: [
            [
                {
                    heading: 'Abbreviated title',
                    fieldId: 'jnl-jcr-scie-abbrev-title',
                    data: [
                        {
                            path: ['fez_journal_jcr_scie', 'jnl_jcr_scie_abbrev_title'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Impact factor',
                    fieldId: 'jnl-jcr-scie-impact-factor',
                    data: [
                        {
                            path: ['fez_journal_jcr_scie', 'jnl_jcr_scie_impact_factor'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: '5 year impact factor',
                    fieldId: 'jnl-jcr-scie-5yr-impact-factor',
                    data: [
                        {
                            path: ['fez_journal_jcr_scie', 'jnl_jcr_scie_5yr_impact_factor'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'JCR version',
                    fieldId: 'jnl-jcr-scie-source-date',
                    data: [
                        {
                            path: ['fez_journal_jcr_scie', 'jnl_jcr_scie_source_year'],
                        },
                    ],
                    template: 'DateTimeTemplate',
                    templateProps: {
                        format: 'YYYY',
                    },
                },
            ],
            [
                {
                    heading: 'JCR home page',
                    fieldId: 'jcr-home-page-scie',
                    staticData: true,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: () => 'https://jcr-clarivate-com.ezproxy.library.uq.edu.au',
                        text: () => 'Go to JCR website',
                        title: 'Open JCR website in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'JCR more info',
                    fieldId: 'jcr-more-info-scie',
                    staticData: true,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: () => 'https://clarivate.com/webofsciencegroup/solutions/webofscience-scie',
                        text: () => 'More info about JCR SCIE',
                        title: 'Open more info in a new tab',
                    },
                },
            ],
        ],
        tabs: {
            tabId: 'fez-journal-jcr-scie-category',
            tabKey: 'fez_journal_jcr_scie_category',
            tabTitle: 'jnl_jcr_scie_category_description_lookup',
            tabContent: {
                rows: [
                    [
                        {
                            heading: 'Ranking',
                            fieldId: 'jnl-jcr-scie-category-ranking',
                            data: [
                                {
                                    path: ['jnl_jcr_scie_category_ranking'],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            heading: 'Quartile',
                            fieldId: 'jnl-jcr-scie-category-quartile',
                            data: [
                                {
                                    path: ['jnl_jcr_scie_category_quartile'],
                                },
                            ],
                        },
                    ],
                ],
            },
        },
    },
    jssci: {
        key: 'fez_journal_jcr_ssci',
        title: 'Clarivate Journal Citation Reports - Social Science Citation index',
        rows: [
            [
                {
                    heading: 'Abbreviated title',
                    fieldId: 'jnl-jcr-ssci-abbrev-title',
                    data: [
                        {
                            path: ['fez_journal_jcr_ssci', 'jnl_jcr_ssci_abbrev_title'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Impact factor',
                    fieldId: 'jnl-jcr-ssci-impact-factor',
                    data: [
                        {
                            path: ['fez_journal_jcr_ssci', 'jnl_jcr_ssci_impact_factor'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: '5 year impact factor',
                    fieldId: 'jnl-jcr-ssci-5yr-impact-factor',
                    data: [
                        {
                            path: ['fez_journal_jcr_ssci', 'jnl_jcr_ssci_5yr_impact_factor'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'JCR version',
                    fieldId: 'jnl-jcr-ssci-source-date',
                    data: [
                        {
                            path: ['fez_journal_jcr_ssci', 'jnl_jcr_ssci_source_year'],
                        },
                    ],
                    template: 'DateTimeTemplate',
                    templateProps: {
                        format: 'YYYY',
                    },
                },
            ],
            [
                {
                    heading: 'JCR home page',
                    fieldId: 'jcr-home-page-ssci',
                    staticData: true,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: () => 'https://jcr-clarivate-com.ezproxy.library.uq.edu.au',
                        text: () => 'Go to JCR website',
                        title: 'Open JCR website in a new tab',
                    },
                },
            ],
            [
                {
                    heading: 'JCR more info',
                    fieldId: 'jcr-more-info-ssci',
                    staticData: true,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: () => 'https://clarivate.com/webofsciencegroup/solutions/webofscience-ssci',
                        text: () => 'More info about JCR SSCI',
                        title: 'Open more info in a new tab',
                    },
                },
            ],
        ],
        tabs: {
            tabId: 'fez-journal-jcr-ssci-category',
            tabKey: 'fez_journal_jcr_ssci_category',
            tabTitle: 'jnl_jcr_ssci_category_description_lookup',
            tabContent: {
                rows: [
                    [
                        {
                            heading: 'Ranking',
                            fieldId: 'jnl-jcr-ssci-category-ranking',
                            data: [
                                {
                                    path: ['jnl_jcr_ssci_category_ranking'],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            heading: 'Quartile',
                            fieldId: 'jnl-jcr-ssci-category-quartile',
                            data: [
                                {
                                    path: ['jnl_jcr_ssci_category_quartile'],
                                },
                            ],
                        },
                    ],
                ],
            },
        },
    },
    'cite-score': {
        key: 'fez_journal_cite_score',
        title: 'Elsevier CiteScore',
        rows: [
            [
                {
                    heading: 'CiteScore version',
                    fieldId: 'jnl-cite-score-source-year',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_source_year'],
                        },
                    ],
                    template: 'DateTimeTemplate',
                    templateProps: {
                        format: 'YYYY',
                    },
                },
                {
                    heading: 'CiteScore',
                    fieldId: 'jnl-cite-score',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score'],
                        },
                    ],
                },
            ],

            [
                {
                    heading: 'CiteScore score',
                    fieldId: 'jnl-cite-score-source-id',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_source_id'],
                        },
                    ],
                    template: 'LinkTemplate',
                    templateProps: {
                        href: item => `https://www-scopus-com.ezproxy.library.uq.edu.au/sourceid/${item}`,
                        title: 'Open CiteScore record in a new tab',
                        text: () => 'Go to record in CiteScore',
                    },
                },
                {
                    heading: 'SNIP',
                    fieldId: 'jnl-cite-score-snip',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_snip'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'CiteScore more info',
                    fieldId: 'jnl-cite-score-more-info',
                    staticData: true,
                    template: 'LinkTemplate',
                    templateProps: {
                        href: () => 'https://service.elsevier.com/app/answers/detail/a_id/14880/supporthub/scopus/',
                        title: 'View more about CiteScore in a new tab',
                        text: () => 'More info about CiteScore',
                    },
                },
                {
                    heading: 'SJR',
                    fieldId: 'jnl-cite-score-sjr',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_sjr'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Percent Cited',
                    fieldId: 'jnl-cite-score-percent-cited',
                    data: [
                        {
                            path: ['fez_journal_cite_score', 'jnl_cite_score_percent_cited'],
                        },
                    ],
                },
            ],
        ],
        tabs: {
            tabId: 'fez-journal-cite-score-asjc-code',
            tabKey: 'fez_journal_cite_score_asjc_code',
            tabTitle: 'jnl_cite_score_asjc_code_lookup',
            tabContent: {
                rows: [
                    [
                        {
                            heading: 'Scopus ASJC Code and sub-subject area',
                            fieldId: 'jnl-cite-score-asjc-code-lookup',
                            data: [
                                {
                                    path: ['jnl_cite_score_asjc_code_lookup'],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            heading: 'Quartile',
                            fieldId: 'jnl-cite-score-asjc-code-quartile',
                            data: [
                                {
                                    path: ['jnl_cite_score_asjc_code_quartile'],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            heading: 'Ranked',
                            fieldId: 'jnl-cite-score-asjc-code-rank',
                            mergeData: true,
                            separator: ' out of ',
                            data: [
                                {
                                    path: ['jnl_cite_score_asjc_code_rank'],
                                },
                                {
                                    path: ['jnl_cite_score_asjc_code_rank_out_of'],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            heading: 'Top 10% (CiteScore Percentile)',
                            fieldId: 'jnl-cite-score-asjc-code-top-10-percent',
                            data: [
                                {
                                    path: ['jnl_cite_score_asjc_code_top_10_percent'],
                                },
                            ],
                            template: 'BooleanTemplate',
                        },
                    ],
                    [
                        {
                            heading: 'Percentile',
                            fieldId: 'jnl-cite-score-asjc-code-percentile',
                            data: [
                                {
                                    path: ['jnl_cite_score_asjc_code_percentile'],
                                },
                            ],
                        },
                    ],
                ],
            },
        },
    },
    index: {
        title: 'Indexed in',
        rows: [
            [
                {
                    heading: 'Essential Science Indicators Research Fields',
                    fieldId: 'jnl-esi-subject-lookup',
                    data: [
                        {
                            isArray: true,
                            primaryKey: 'fez_journal_esi',
                            path: [],
                        },
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item => `${item.jnl_esi_subject_lookup} (${item.jnl_esi_issn})`,
                    },
                },
            ],
            [
                {
                    heading: 'Art and Humanities Citation Index (AHCI) - WOS Subject Categories',
                    fieldId: 'jnl-wos-category-ahci',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_wos_category &&
                        journalDetails.fez_journal_wos_category.filter(item => item.jnl_wos_category_index === 'AHCI')
                            .length > 0 &&
                        journalDetails.fez_journal_wos_category,
                    template: 'WosCategoriesTemplate',
                    templateProps: {
                        filterFn: item => item.jnl_wos_category_index === 'AHCI',
                        categoryId: 'ahci',
                    },
                },
            ],
            [
                {
                    heading: 'Science Citation Index Expanded - WOS Subject Categories',
                    fieldId: 'jnl-wos-category-scie',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_wos_category &&
                        journalDetails.fez_journal_wos_category.filter(item => item.jnl_wos_category_index === 'SCIE')
                            .length > 0 &&
                        journalDetails.fez_journal_wos_category,
                    template: 'WosCategoriesTemplate',
                    templateProps: {
                        filterFn: item => item.jnl_wos_category_index === 'SCIE',
                        categoryId: 'scie',
                    },
                },
            ],
            [
                {
                    heading: 'Social Science Citation Index - WOS Subject Categories',
                    fieldId: 'wos-category-ssci',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_wos_category &&
                        journalDetails.fez_journal_wos_category.filter(item => item.jnl_wos_category_index === 'SSCI')
                            .length > 0 &&
                        journalDetails.fez_journal_wos_category,
                    template: 'WosCategoriesTemplate',
                    templateProps: {
                        filterFn: item => item.jnl_wos_category_index === 'SSCI',
                        categoryId: 'ssci',
                    },
                },
            ],
            [
                {
                    heading: 'Emerging Sources Citation Index - WOS Subject Categories',
                    fieldId: 'jnl-wos-category-esci',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_wos_category &&
                        journalDetails.fez_journal_wos_category.filter(item => item.jnl_wos_category_index === 'ESCI')
                            .length > 0 &&
                        journalDetails.fez_journal_wos_category,
                    template: 'WosCategoriesTemplate',
                    templateProps: {
                        filterFn: item => item.jnl_wos_category_index === 'ESCI',
                        categoryId: 'esci',
                    },
                },
            ],
            [
                {
                    heading: 'Scopus',
                    fieldId: 'has-scopus',
                    getData: journalDetails => !!journalDetails.fez_journal_cite_score,
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'Pubmed',
                    fieldId: 'has-pubmed',
                    getData: journalDetails => !!journalDetails.fez_journal_pubmed,
                    template: 'BooleanTemplate',
                },
            ],
        ],
    },
    listed: {
        title: 'Listed in',
        rows: [
            [
                {
                    heading: 'Australian Business Deans Council journal quality list',
                    fieldId: 'jnl-abdc-rating',
                    data: [
                        {
                            path: ['fez_journal_abdc', 'jnl_abdc_rating'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Field of Research Codes',
                    fieldId: 'jnl-abdc-for-code-lookup',
                    data: [
                        {
                            path: ['fez_journal_abdc', 'jnl_abdc_for_code_lookup'],
                        },
                    ],
                },
            ],
            [
                {
                    heading: 'Current list',
                    fieldId: 'jnl-abdc-source-date',
                    data: [
                        {
                            path: ['fez_journal_abdc', 'jnl_abdc_source_date'],
                        },
                    ],
                    template: 'DateTimeTemplate',
                    templateProps: {
                        format: 'Do MMMM YYYY',
                    },
                },
            ],
            [
                {
                    heading: 'CWTS Leiden Ranking',
                    fieldId: 'jnl-cwts-source-year',
                    getData: journalDetails => {
                        const status =
                            Array.isArray(journalDetails.fez_journal_wos_category) &&
                            journalDetails.fez_journal_wos_category.some(
                                category => category.fez_journal_cwts && category.fez_journal_cwts.jnl_cwts_source_year,
                            );
                        const year =
                            Array.isArray(journalDetails.fez_journal_wos_category) &&
                            journalDetails.fez_journal_wos_category.reduce(
                                (firstcwtsSourceYear, category) =>
                                    firstcwtsSourceYear ||
                                    (category.fez_journal_cwts && category.fez_journal_cwts.jnl_cwts_source_year),
                                '',
                            );

                        return status ? `Yes${year ? `, ${year}` : ''}` : 'No';
                    },
                },
            ],
            [
                {
                    heading: 'Excellence in Research for Australia (ERA)',
                    fieldId: 'fez-journal-era',
                    getData: journalDetails =>
                        !!journalDetails.fez_journal_era && journalDetails.fez_journal_era.length > 0,
                    template: 'BooleanTemplate',
                },
            ],
            [
                {
                    heading: 'ERA Years with Field of Research codes',
                    fieldId: 'jnl-era-for-code-lookup',
                    data: [
                        {
                            path: ['fez_journal_era'],
                        },
                    ],
                    template: 'MultiValueTemplate',
                    templateProps: {
                        getData: item =>
                            `${item.jnl_era_source_year} - ${(Array.isArray(item.fez_journal_era_for_code) &&
                                item.fez_journal_era_for_code.map(code => code.jnl_era_for_code_lookup).join(', ')) ||
                                ''}`,
                    },
                },
            ],
            [
                {
                    heading: 'Nature Index',
                    fieldId: 'jnl-nature-index-source-date',
                    getData: journalDetails =>
                        `${!!journalDetails.fez_journal_nature_index ? 'Yes' : 'No'}${
                            !!journalDetails.fez_journal_nature_index
                                ? ', ' +
                                  moment(
                                      journalDetails.fez_journal_nature_index.jnl_nature_index_source_date,
                                      'Do MMMM YYYY',
                                  )
                                : ''
                        }`,
                },
            ],
        ],
    },
};
