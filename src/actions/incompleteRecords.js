import * as actions from './actionTypes';
import * as transformers from './transformers';
import { get, patch } from 'repositories/generic';
import { INCOMPLETE_RECORDS_API, EXISTING_RECORD_API } from 'repositories/routes';
import { putUploadFiles } from 'repositories';

/**
 * Load a list of incomplete NTRO Records from fez
 * @returns {action}
 */
export function loadIncompleteRecords() {
    return dispatch => {
        dispatch({type: actions.INCOMPLETE_RECORDS_LOADING});

        return get(INCOMPLETE_RECORDS_API())
            .then(response => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_FAILED,
                    payload: error.message
                });
            });
    };
}


/**
 * Update incomplete record request: patch record, send issue to espace admins:
 *      update record with uploaded files, other field data
 *      send issue message to notify espace team
 *      upload files,
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data: {publication, author, files}
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function updateIncompleteRecord(data) {
    if (!data.publication || !data.author) {
        return dispatch => {
            dispatch({
                type: actions.FIX_RECORD_FAILED,
                payload: 'Incomplete data for requests'
            });

            return Promise.reject(new Error('Incomplete data for requests'));
        };
    }

    // const isAuthorLinked = data.publication.fez_record_search_key_author_id && data.publication.fez_record_search_key_author_id.length > 0 &&
    //     data.publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === data.author.aut_id).length > 0;

    // const isContributorLinked = data.publication.fez_record_search_key_contributor_id && data.publication.fez_record_search_key_contributor_id.length > 0 &&
    //     data.publication.fez_record_search_key_contributor_id.filter(contributorId => contributorId.rek_contributor_id === data.author.aut_id).length > 0;

    const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

    // if (!isAuthorLinked && !isContributorLinked) {
    //     return dispatch => {
    //         dispatch({
    //             type: actions.FIX_RECORD_FAILED,
    //             payload: 'Current author is not linked to this record'
    //         });
    //         return Promise.reject(new Error('Current author is not linked to this record'));
    //     };
    // }

    return dispatch => {
        dispatch({type: actions.FIX_RECORD_PROCESSING});

        // if user updated links/added files - update record
        let patchRecordRequest = null;
        if (hasFilesToUpload || data.rek_link) {
            patchRecordRequest = {
                rek_pid: data.publication.rek_pid,
                ...transformers.getRecordLinkSearchKey(data),
                ...transformers.getRecordFileAttachmentSearchKey(data.files ? data.files.queue : [], data.publication)
            };
        }

        // create request for issue notification
        // const createIssueRequest = transformers.getFixIssueRequest(data);

        return Promise.resolve([])
            .then(()=> (hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, data.files.queue, dispatch) : null))
            .then(()=> (hasFilesToUpload || data.rek_link ? patch(EXISTING_RECORD_API({pid: data.publication.rek_pid}), patchRecordRequest) : null))
            // .then(()=> (post(RECORDS_ISSUES_API({pid: data.publication.rek_pid}), createIssueRequest)))
            .then(responses => {
                dispatch({
                    type: actions.FIX_RECORD_SUCCESS,
                    payload: {
                        pid: data.publication.rek_pid
                    }
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: actions.FIX_RECORD_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            });
    };
}
