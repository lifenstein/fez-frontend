import {post, get} from './generic';

export const GET_POSSIBLE_PUBLICATIONS_API = 'publications/possible-unclaimed';
export const GET_USER_PUBLICATIONS_API = 'publications/claimed';
export const GET_USER_TRENDING_PUBLICATIONS_API = 'academic/[username]/trending_publications';
export const GET_COUNT_POSSIBLE_PUBLICATIONS_API = 'publications/possible-counts';
export const POST_HIDE_POSSIBLE_PUBLICATIONS_API = 'publications/hide-possible';
export const POST_CLAIM_POSSIBLE_PUBLICATIONS_API = 'publications/claim-possible';

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {string}
 */
function getFacetsQueryString(facets) {
    return Object.keys(facets).map(key => {
        return ('filters[facets][' + key + ']=' + facets[key]);
    }).join('&');
}

/**
 * Loads a list of possible unclaimed publications per user name
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getPossibleUnclaimedPublications(userName, activeFacets = {}) {
    return get(`${GET_POSSIBLE_PUBLICATIONS_API}/${userName}?${getFacetsQueryString(activeFacets)}`);
}

/**
 * Returns published publications for user
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getPublications({userName, page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', facets = {}}) {
    return get(`${GET_USER_PUBLICATIONS_API}/${userName}?page=${page}&per_page=${pageSize}&sort=${sortBy}&order_by=${sortDirection}&${getFacetsQueryString(facets)}`);
}

/**
 * Returns trending publications
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getTrendingPublications(userName) {
    return get(GET_USER_TRENDING_PUBLICATIONS_API.replace('[username]', userName));
}

/**
 * Loads a count of possible unclaimed publications per user name
 * @param {string} userName of user for whom to apply the action
 * @returns {Promise}
 */
export function getCountPossibleUnclaimedPublications({userName}) {
    return get(`${GET_COUNT_POSSIBLE_PUBLICATIONS_API}/${userName}`);
}

/**
 * Hide a list of PIDS for a user
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postHidePossiblePublications(data) {
    return post(POST_HIDE_POSSIBLE_PUBLICATIONS_API, data);
}

/**
 * Post a request to claim possible publication with additional data
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function postClaimPossiblePublication(data) {
    return post(POST_CLAIM_POSSIBLE_PUBLICATIONS_API, data);
}
