import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';
import {record} from "mock/data";
import {locale} from 'locale';

describe('Record action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('createNewRecord()', () => {

        it('dispatches expected actions on successful save', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "files": {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, {data: {}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

    });

    describe('submitThesis()', () => {

        it('dispatches expected actions on successful save', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "files": {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, {data: {}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [
                actions.CREATE_RECORD_RESET
            ];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

});
