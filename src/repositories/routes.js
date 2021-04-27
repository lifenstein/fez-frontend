import { validation, openAccessConfig } from 'config';
import {
    IN_CREATION,
    IN_DRAFT,
    IN_REVIEW,
    UNPUBLISHED,
    RETRACTED,
    SUBMITTED_FOR_APPROVAL,
    PUB_SEARCH_BULK_EXPORT_SIZE,
} from 'config/general';
import param from 'can-param';

export const zeroPaddedYear = value => (value ? ('0000' + value).substr(-4) : '*');

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {object}
 */
export const getFacetsParams = facets => {
    const facetsParam = {};
    if (facets.hasOwnProperty('filters')) {
        Object.keys(facets.filters).map(key => {
            facetsParam[`filters[facets][${key}]`] = facets.filters[key];
        });
    }

    if (facets.hasOwnProperty('ranges')) {
        Object.keys(facets.ranges).map(key => {
            if (key === 'Year published') {
                const { from, to } = facets.ranges[key];
                const fromValueForEs = !!from && !!to && from > to ? zeroPaddedYear(to) : zeroPaddedYear(from);
                const toValueForEs = !!from && !!to && to < from ? zeroPaddedYear(from) : zeroPaddedYear(to);
                facetsParam[`ranges[facets][${key}]`] = `[${fromValueForEs} TO ${toValueForEs}]`;
            } else {
                facetsParam[`ranges[facets][${key}]`] = facets.ranges[key];
            }
        });
    }

    return facetsParam;
};

export const getStandardSearchParams = ({
    exportPublicationsFormat = '',
    page = 1,
    pageSize = 20,
    sortBy = 'score',
    sortDirection = 'desc',
    withUnknownAuthors = -1,
    facets = {},
}) => {
    const unknownAuthors = withUnknownAuthors >= 0 ? { with_unknown_authors: withUnknownAuthors } : {};

    return {
        export_to: exportPublicationsFormat,
        page: page,
        per_page: pageSize,
        sort: sortBy,
        order_by: sortDirection.toLowerCase(),
        ...getFacetsParams(facets),
        ...unknownAuthors,
    };
};

export const getOpenAccessSearchParams = ({ facets = {} }) => ({
    ...(!!facets.showOpenAccessOnly ? { rek_oa_status: openAccessConfig.openAccessIds } : {}),
});

/**
 * getSearchType - based on data provided returns query string attribute
 * @param {string} pid/pubmed/string title to search
 * @returns {object} query string attribute based on input
 */
export const getSearchType = searchQuery => {
    if (!searchQuery) return {};

    if (validation.isValidDOIValue(searchQuery)) {
        return { doi: searchQuery.trim() };
    }

    if (validation.isValidPubMedValue(searchQuery)) {
        return { id: `pmid:${searchQuery.trim()}` };
    }

    return { title: searchQuery };
};

export const CURRENT_ACCOUNT_API = () => ({
    apiUrl: 'account',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const AUTHORS_SEARCH_API = ({ query }) => ({
    apiUrl: 'fez-authors/search',
    options: { params: { query: query, rule: 'lookup' } },
});
export const CURRENT_AUTHOR_API = () => ({ apiUrl: 'fez-authors' });
export const AUTHOR_API = ({ authorId }) => ({ apiUrl: `fez-authors/${authorId}` });
export const AUTHOR_DETAILS_API = ({ userId }) => ({
    apiUrl: `authors/details/${userId}`,
});
export const AUTHOR_ORCID_DETAILS_API = ({ userId, params }) => ({
    apiUrl: `orcid/${userId}/request`,
    options: { params: { ...params } },
});

// academic stats apis

export const ACADEMIC_STATS_PUBLICATION_HINDEX_API = ({ userId }) => ({ apiUrl: `academic/${userId}/hindex` });
export const AUTHOR_TRENDING_PUBLICATIONS_API = () => ({ apiUrl: 'records/my-trending' });

// lookup apis
export const GET_NEWS_API = () => ({ apiUrl: 'fez-news' });
export const VOCABULARIES_API = ({ id }) => ({ apiUrl: `vocabularies?cvo_ids=${id}` });
export const GET_PUBLICATION_TYPES_API = () => ({ apiUrl: 'records/types' });
export const JOURNAL_LOOKUP_API = ({ query }) => ({
    apiUrl: `journals/search?rule=lookup&query=${query}`,
});

// file uploading apis
export const FILE_UPLOAD_API = () => ({ apiUrl: 'file/upload/presigned' });

// create/patch record apis
export const NEW_RECORD_API = () => ({ apiUrl: 'records' });

export const NEW_COLLECTION_API = () => ({ apiUrl: 'collections' });

export const NEW_COMMUNITY_API = () => ({ apiUrl: 'communities' });

export const EXISTING_RECORD_API = ({ pid, isEdit }) => ({
    apiUrl: `records/${pid}${isEdit ? '?from=admin-form' : ''}`,
});

export const EXISTING_COLLECTION_API = ({ pid }) => ({ apiUrl: `records/${pid}` });

export const EXISTING_COMMUNITY_API = ({ pid }) => ({ apiUrl: `records/${pid}` });

export const RECORDS_ISSUES_API = ({ pid }) => ({ apiUrl: `records/${pid}/issues` });

// search/list records apis
export const POSSIBLE_RECORDS_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'possible',
            ...getStandardSearchParams(values),
            ...getOpenAccessSearchParams(values),
        },
    },
});

// (POST: with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])`);
export const HIDE_POSSIBLE_RECORD_API = () => ({ apiUrl: 'records/search', options: { params: { rule: 'possible' } } });

export const CURRENT_USER_RECORDS_API = (values, route = 'search') => ({
    apiUrl: `records/${route}`,
    options: {
        params: {
            rule: 'mine',
            ...getStandardSearchParams(values),
            ...getOpenAccessSearchParams(values),
        },
    },
});

export const INCOMPLETE_RECORDS_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'incomplete',
            ...getStandardSearchParams(values),
            ...getOpenAccessSearchParams(values),
        },
    },
});

export const AUTHOR_PUBLICATIONS_STATS_ONLY_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'mine',
            'filters[stats_only]': true,
            ...getStandardSearchParams(values),
            ...getOpenAccessSearchParams(values),
        },
    },
});
export const TRENDING_PUBLICATIONS_API = () => ({ apiUrl: 'records/trending' });

export const formatSearchQueryParams = ({ result, key, searchQueryParams }) => {
    const { value } = searchQueryParams[key];
    switch (key) {
        case 'rek_pid':
            if (value.toLowerCase().indexOf('uq:') !== 0) {
                return {
                    ...result,
                    [key]: `UQ:${value}`,
                };
            }
            break;
        case 'rek_genre_type':
            return {
                ...result,
                [key]: value.map(item => `"${item}"`),
            };
        case 'rek_status':
            return {
                ...result,
                [key]:
                    value < 0
                        ? [UNPUBLISHED, SUBMITTED_FOR_APPROVAL, IN_CREATION, IN_REVIEW, IN_DRAFT, RETRACTED]
                        : value,
            };
        case 'rek_created_date':
        case 'rek_updated_date':
            return result;
        case 'all':
            return {
                ...result,
                [key]: value,
            };
        default:
            break;
    }

    return {
        ...result,
        [key]: !!value ? value : searchQueryParams[key],
    };
};

export const SEARCH_INTERNAL_RECORDS_API = (query, route = 'search') => {
    // query = {searchQuery (text value - title search, doi or pubmed id)
    // searchQueryParams = {} (search parameters, eg title, author etc)
    // page = 1, pageSize = 20, sortBy = 'score', sortDirection = 'desc', facets = {}}
    let { searchQueryParams } = query;

    // convert {value, label} from advanced search to value string from api
    const searchQueryParamsWithoutLabels =
        (query.searchMode === 'advanced' &&
            !!searchQueryParams &&
            Object.keys(searchQueryParams).reduce(
                (result, key) => formatSearchQueryParams({ result, key, searchQueryParams }),
                {},
            )) ||
        searchQueryParams;

    const values = { ...query, searchQueryParams: searchQueryParamsWithoutLabels };

    searchQueryParams = {
        ...values.searchQueryParams,
        ...getOpenAccessSearchParams(values),
    };

    let advancedSearchQueryParams = null;
    if (values.searchMode === 'advanced') {
        advancedSearchQueryParams = {
            mode: 'advanced', // mode to let axios request interceptor to know for serialising query params
            key: { ...searchQueryParams },
        };
    }

    const exportParams = {};
    if (route === 'export' && query.pageSize === PUB_SEARCH_BULK_EXPORT_SIZE) {
        // eslint-disable-next-line no-unused-vars
        const { exportPublicationsFormat, ...queryValuesToSend } = query;
        exportParams.querystring = encodeURIComponent(param(queryValuesToSend));
    }

    return {
        apiUrl: `records/${route}`,
        options: {
            params: {
                ...getSearchType(values.searchQuery),
                ...getStandardSearchParams(values),
                ...(advancedSearchQueryParams || searchQueryParams),
                ...exportParams,
            },
        },
    };
};

export const SEARCH_EXTERNAL_RECORDS_API = ({ source = 'wos', searchQuery = '' }) => ({
    apiUrl: 'external/records/search',
    options: { params: { source: source, ...getSearchType(searchQuery) } },
});

export const SEARCH_KEY_LOOKUP_API = ({ searchKey, searchQuery }) => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'lookup',
            search_key: searchKey,
            lookup_value: searchQuery,
        },
    },
});

export const SEARCH_AUTHOR_LOOKUP_API = ({ searchQuery }) => ({
    apiUrl: 'fez-authors/search',
    options: {
        params: {
            rule: 'lookup',
            query: searchQuery.replace(/[.,\/?#!$%\^&\*;:{}=\_`~()]/g, ' ').replace(/ +(?= )/g, ''),
        },
    },
});

export const THIRD_PARTY_LOOKUP_API_1FIELD = ({ type, field1 }) => ({
    apiUrl: `tool/lookup/${type}/${field1}`,
});

export const THIRD_PARTY_LOOKUP_API_2FIELD = ({ type, field1, field2 }) => ({
    apiUrl: `tool/lookup/${type}/${field1}/${field2}`,
});

export const COLLECTIONS_BY_COMMUNITY_LOOKUP_API = ({ communityPid }) => ({
    apiUrl: `communities/${communityPid}/collections`,
});

export const BATCH_IMPORT_DIRECTORIES_API = () => ({
    apiUrl: 'external/records/batch-import/directories',
});

export const BATCH_IMPORT_API = () => ({
    apiUrl: 'external/records/batch-import',
});

export const MASTER_JOURNAL_LIST_INGEST_API = () => ({
    apiUrl: 'journals/batch-import',
});

export const ISSN_LINKS_API = ({ type, issn }) => ({
    apiUrl: `tool/lookup/local/${type}/${issn}`,
});

export const ORCID_SYNC_API = () => ({
    apiUrl: 'external/orcid/jobs/sync',
});

export const UNLOCK_RECORD_API = ({ pid }) => ({
    apiUrl: `records/${pid}/unlock`,
});

export const BULK_UPDATES_API = () => ({
    apiUrl: 'records/bulk-updates',
});

export const FAVOURITE_SEARCH_LIST_API = ({ id } = { id: undefined }) => ({
    apiUrl: `favourite_search${!!id ? `/${id}` : ''}`,
});

export const JOURNAL_API = ({ id }) => ({
    apiUrl: `journals/${id}`,
});

export const MY_EDITORIAL_APPOINTMENT_LIST_API = ({ id } = { id: undefined }) => ({
    apiUrl: `editorial-appointment${!!id ? `/${id}` : ''}`,
});
