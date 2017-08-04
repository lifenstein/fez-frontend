/* eslint-disable */
import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/account';
import {externalDoiSearchResultList, externalPubMedSearchResultsList, externalTitleSearchResultsList} from './data/search/external';
import {publicationTypeList} from './data/records';
import {publicationSubtypeList} from './data/vocabularies';
import {publicationYearsBig} from './data/academic/publicationYears';
import {possibleUnclaimed, possibleCounts} from './data/publications';
import {authorsSearch, currentAuthor, authorDetails} from './data/authors/index';
import {quickTemplates} from './data/acml';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 2000 });

// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

//get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

if (user && !accounts[user]) {
    console.warn("API MOCK DATA: User name is not found, please use one of the usernames from mock data only...");
}

if (user === 'anon') {
    // Mock unauthorised response
    mock.onGet(/account\?[0-9]*/).reply(403, {});
    mock.onGet(/authors\/details*/).reply(403, {});
    mock.onGet(/authors/).reply(403, {});
} else {
    // use default uqresearcher
    user = user || 'uqresearcher';

    // Mock the account that the user is logged in as
    mock.onGet(/account\?[0-9]*/).reply(200, accounts[user]);

    // Mock get current author details
    if (authorDetails[user])
        mock.onGet(/authors\/details*/).reply(200, authorDetails[user]);
    else
        mock.onGet(/authors\/details*/).reply(404, {});

    // Mock get current author details
    if (currentAuthor[user]) {
        mock.onGet(/authors/).reply(200, currentAuthor[user]);
    } else {
        mock.onGet(/authors/).reply(404, []);
    }
}

// Mock the publication form internal search
mock.onGet(/search\/internal\?*/).reply(500);

// Mock the publication form external title search endpoint
mock.onGet(/search\/external\?source=wos&title=*/).reply(200, externalTitleSearchResultsList);
mock.onGet(/search\/external\?source=crossref&title=*/).reply(404);
mock.onGet(/search\/external\?source=scopus&title=*/).reply(404);
mock.onGet(/search\/external\?source=pubmed&title=*/).reply(404);

// Mock the publication form external pubMed search endpoint
mock.onGet(/search\/external\?id=pmid=*/).reply(200, externalPubMedSearchResultsList);

// Mock the publication form external doi search endpoint
mock.onGet(/search\/external\?doi=*/).reply(200, externalDoiSearchResultList);

// Mock the publication types endpoint
mock.onGet('records/types').reply(200, publicationTypeList);

// Mock the publication sub types endpoint
mock.onGet(/vocabularies\/[0-9]/).reply((config) => {
    const vocabId = config.url.substring(config.url.indexOf('/')+1);
    return [200, publicationSubtypeList[vocabId]];
});

// Mock the authors endpoint
// get authors search results
mock.onGet(/authors\/search\?query=*/).reply(200, authorsSearch);

// Error codes:
// 404: author not found
// mock.onGet(/authors/).reply(404);
// 403: current user is not authorised
// mock.onGet(/authors/).reply(403);

// Mock academics publication years endpoint response
mock.onGet(/academic\/[a-z0-9]*\/publication-years/).reply(200, publicationYearsBig);

// Allow the file upload calls to pass through to the S3 bucket directly
mock.onGet(/file\/upload\/presigned/).passThrough();
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/).passThrough();

// Mock claim publication results endpoint response
mock.onGet(/publications\/possible-unclaimed\/[a-z0-9]/).reply(200, possibleUnclaimed);
mock.onGet(/(publications\/possible-counts)/).reply(200, possibleCounts);
// mock.onGet(/(publications\/possible-unclaimed)/).reply(200, []);

// Mock hide publication results endpoint response
mock.onPost(/(publications\/hide-possible)/).reply(200, {});

// Mock claim possible publication endpoint response
mock.onPost('publications/claim-possible').reply(200, {});

// Mock the document access types
mock.onGet('acml/quick-templates').reply(200, quickTemplates);

// Let the create records endpoint go through to staging
mock.onPost('records').reply(200, {});

