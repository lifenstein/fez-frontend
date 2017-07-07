import React from 'react';
import FontIcon from 'material-ui/FontIcon';

export default {
    global: {
        title: 'UQ eSpace',
        logo: 'https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg',
        labels: {
            buttons: {
                cancel: 'Cancel',
                abandon: 'Abandon and search again',
                close: 'Close',
                delete: 'Delete',
                submitForApproval: 'Submit for approval',
                submissionInProgress: 'Submitting...',
                claimPublication: 'Claim this publication'
            }
        }
    },
    authentication: {
        signInText: 'Log in',
        signOutText: 'Log out'
    },
    menu: {
        myDashboard: {
            primaryText: 'My dashboard'
        },
        myResearch: {
            primaryText: 'My research'
        },
        addMissingRecord: {
            primaryText: 'Add a missing record'
        },
        claimPublication: {
            primaryText: 'Claim possible publications'
        },
        manageUsers: {
            primaryText: 'Manage users'
        },
        manageGroups: {
            primaryText: 'Manage groups'
        },
        manageAuthors: {
            primaryText: 'Manage authors'
        },
        browse: {
            primaryText: 'Browse',
            secondaryText: 'UQ\'s digital repository'
        },
        search: {
            primaryText: 'Search'
        },
        faqs: {
            primaryText: 'FAQs'
        },
        about: {
            primaryText: 'About',
        },
    },
    mapping: {
        vocabs: [
            {'documentId': 174, 'vocabId': 453581},
            {'documentId': 177, 'vocabId': 453588},
            {'documentId': 130, 'vocabId': 453596},
            {'documentId': 313, 'vocabId': 453594},
            {'documentId': 179, 'vocabId': 453573}
        ]
    },
    pages: {
        about: {
            title: 'About UQ eSpace',
            text: (
                <div>
                    <h3>Information</h3>
                    <p>UQ eSpace is the single authoritative source for the research outputs and research data of the
                        staff and students of the University of Queensland and is the archival home of UQ Research
                        Higher Degree digital theses. UQ eSpace raises the visibility and accessibility of UQ
                        publications to the wider world and provides data for mandatory Government reporting
                        requirements such as Excellence in Research for Australia (ERA), as well as for internal UQ
                        systems, including Academic Portal and the DataHub. It operates as an institutional repository
                        for open access publications, research datasets and other digitised materials created by staff
                        of the University such as print materials, photographs, audio materials, videos, manuscripts and
                        other original works. UQ eSpace provides metadata to UQ Researchers in order to raise the
                        publication profile of researchers at UQ.</p>
                    <p>The University of Queensland has implemented an Open Access for UQ Research Outputs policy that
                        requires UQ researchers to make publications arising from their research openly available via UQ
                        eSpace. It has also implemented a Research Data Management policy that sets out the requirements
                        for University of Queensland researchers to ensure that their research data are managed
                        according to legal, statutory, ethical and funding body requirements.</p>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br/>
                        Email: espace@library.uq.edu.au <br/>
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Andrew Heath <br/>
                        Manager, UQ eSpace<br/>
                        Tel: 07 334 69981<br/>
                        Email: a.heath@library.uq.edu.au<br/>
                    </p>
                    <p>
                        Mary-Anne Marrington<br/>
                        Senior Librarian, UQ eSpace<br/>
                        Tel: 07 334 69775<br/>
                        Email: m.marrington@library.uq.edu.au<br/>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        browse: {
            title: 'Browse eSpace',
            text: ( <div>
                    <p>Welcome to The University of Queensland's institutional digital repository</p>
                    <p>
                        <a href="https://auth.library.uq.edu.au/login">Please, login to continue.</a>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        addRecord: {
            title: 'Add a missing record to eSpace',
            stepper: {
                step1Label: 'Search for your publication',
                step2Label: 'Search results',
                step3Label: 'Add your publication',
                defaultErrorMessage: 'Error'
            },
            searchForPublication: {
                title: 'Search for your publication',
                explanationText: 'Enter either the publication DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of the publication. This will allow us to check whether the record is already in eSpace or is available from another source.',
                defaultSearchFieldLabel: 'Enter DOI, Pubmed Id or Title',
                defaultButtonLabel: 'Search',
                errorMsg: 'Please enter a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
                help: {
                    title: 'Search for your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                }
            },
            inlineLoader: {
                message: 'Loading ...'
            },
            searchResults: {
                title: 'Possible matches found',
                explanationText: 'Top [noOfResults] potential match(es) displayed - claim a matching publication below, refine your search or create a new eSpace record.',
                claimRecordBtnLabel: 'Claim This Publication',
                help: {
                    title: 'Possible matches found',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                limit: 5
            },
            noMatchingRecords: {
                title: 'No matching records found',
                explanationText: 'We were unable to match any results to your search criteria. Please, search again or create a new eSpace record.',
                searchAgainBtnLabel: 'Search again',
                addPublicationBtnLabel: 'Add a new publication',
                help: {
                    title: 'No matchings records?',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                defaultProps: {
                    searchAgainBtnLabel: 'Search again?',
                    addPublicationBtnLabel: 'Add new publication'
                }
            },
            publicationTypeForm: {
                popularTypesList: ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'],
                title: 'Add your publication',
                maxSearchResults: 10,
                publicationTypeLabel: 'Select publication type',
                selectFirstOptionLabel: 'Choose a publication type',
                help: {
                    title: 'Add your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                documentTypes: {
                    JOURNAL_ARTICLE: 'journal article'
                }
            },
            addJournalArticle: {
                journalArticleInformation: {
                    title: 'Journal article information',
                    help: {
                        title: 'Journal article information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        titleLabel: 'Title',
                        nameLabel: 'Journal name',
                        publishDateLabel: 'Publishing date',
                        publicationSubType: 'Publication subtype',
                        selectFirstPublicationSubTypeLabel: 'Choose a publication subtype',
                    }
                },
                optionalDetails: {
                    title: 'Optional publication details',
                    help: {
                        title: 'Optional publication details',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        volumeLabel: 'Volume',
                        issueLabel: 'Issue',
                        startPageLabel: 'Start page',
                        endPageLabel: 'End page',
                        articleNumber: 'Article number',
                        notesLabel: 'Notes (not publicly viewable)',
                        urlLabel: 'Link (URL)'
                    }
                },
                dialog: {
                    success: {
                        title: 'Your record has been submitted',
                        content: 'Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection. Please note that our current processing priority is for publications between 2008 and 2014 to meet the requirements of ERA 2015, HERDC 2015 and Q-index.',
                        primaryButtonLabel: 'Ok',
                        primaryLink: '/dashboard',
                        secondaryButtonLabel: 'Add another missing record'
                    },
                    cancel: {
                        title: 'Cancel adding a missing record',
                        content: 'Are you sure you want to cancel adding this record?',
                        primaryButtonLabel: 'Yes',
                        primaryLink: '/dashboard',
                        secondaryButtonLabel: 'No'
                    }
                }
            }
        },
        claimPublications: {
            title: 'Claim possible publications',
            maxSearchResults: 5,
            claimUrl: '/claim-publications/publication-',
            authorLinking: {
                title: 'Author linking',
                subTitle: 'We were unable to automatically detect who you are from the list of authors on this publication. Please select your name from the list below:',
                confirmation: 'I confirm and understand that I am claiming this publication under the above name, and confirm this is me',
                formSectionPrefix: 'authorLinking',
                instructions: 'Please select an author to proceed',
                noAuthorSelectedMessage: 'Please select an author before submitting the form'
            },
            claimPublicationResults: {
                title: 'Possible publications found',
                explanationText: 'Select any items below to claim them as your work',
                text: ( <div>
                        <p>
                            possibly your publications....
                        </p>
                    </div>
                ),
                help: {
                    title: 'Help',
                    text: (
                        <div>
                            <p>
                                Help on possibly your publications...
                            </p>
                        </div>
                    ),
                    button: 'OK'
                },
                claimRecordBtnLabel: 'Claim This Publication',
                noMatchingPublications: {
                    title: 'No matching publications found',
                    explanationText: 'No publications were automatically matched for you to claim.',
                    help: {
                        title: 'No publications found',
                        text: (
                            <div>
                                <p>
                                    Help on no publications found...
                                </p>
                            </div>
                        ),
                        button: 'OK'
                    }
                },
                dialog: {
                    markNotMine: {
                        title: 'Hide publications',
                        content: 'Are you sure you want to hide these publications?',
                        primaryButtonLabel: 'Yes',
                        primaryLink: '/claim-publications',
                        secondaryButtonLabel: 'No'
                    }
                }
            },
            formButtons: {
                claimLabel: 'Claim this publication',
                notMineLabel: 'None of these publications are mine'
            },
            form: {
                title: 'Claim a publication',
                publicationDetails: {
                    title: 'You are claiming to be an author for the following item:',
                    help: {
                        title: 'Claim a publication',
                        text: (
                            <div>
                                <p>
                                    Mauris pharetra vel arcu in hendrerit. Ut iaculis, quam id cursus fringilla, velit enim sodales dui, sed commodo massa justo quis dui. Nulla ornare massa nibh, quis laoreet eros ultrices nec. Curabitur efficitur ipsum ut metus dignissim ornare. Vestibulum fringilla viverra tortor ac hendrerit.
                                </p>
                            </div>
                        ),
                        button: 'OK'
                    },
                },
                comments: {
                    title: 'If necessary, please suggest changes or upload additional files below',
                    fields: {
                        descriptionLabel: 'Type edits/changes/comments here'
                    }
                },
                files: {
                    title: 'Upload new files',
                    fields: {
                        filenameLabel: 'Filename selected',
                        filenameRestrictions: (
                            <div className="fileInstructions">
                                <h3>File name restrictions</h3>
                                <div style={{width: '100%'}}>
                                    <ul>
                                        <li>Only upper or lowercase alphanumeric characters or underscores (a0z, A-Z, _ and 0-9 only)</li>
                                        <li>Only numbers and lowercase characters in the file extension</li>
                                        <li>Under 45 characters</li>
                                        <li>Only one file extension (on period (.) character) and</li>
                                        <li>Starting with a letter. Eg "s12345678_phd_thesis.pdf"</li>
                                    </ul>
                                </div>
                            </div>
                        ),
                        accessConditionsLabel: 'Access conditions',
                        embargoDateLabel: 'Embargo date',
                        descriptionLabel: 'Description'
                    },
                    buttons: {
                        browseLabel: 'Browse files'
                    }
                },
                dialog: {
                    success: {
                        title: 'Claim publication',
                        content: 'The publication has been successfully claimed.',
                        primaryButtonLabel: 'Ok',
                        primaryLink: '/claim-publications'
                    },
                    cancel: {
                        title: 'Cancel claiming publication',
                        content: 'Are you sure you want to cancel claiming this publication?',
                        primaryButtonLabel: 'Yes',
                        primaryLink: '/claim-publications',
                        secondaryButtonLabel: 'No'
                    }
                }
            }
        }
    },
    sharedComponents: {
        authors: {
            title: 'Authors',
            help: {
                title: 'Authors',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
            fields: {
                authorName: 'authorName',
                authorIdentifier: 'authorIdentifier',
                authorNameLabel: 'Add an author (name as published)',
                authorIdentifierLabel: 'UQ identifier',
                autoCompleteFirstEntryLabel: 'Add author as entered:'
            },
            rows: {
                moveRecordUp: 'Move record up the order',
                moveRecordDown: 'Move record down the order',
                removeRecord: 'Remove this author'
            },
            messages: {
                authorIdentifierExists: 'Author identifier is already added',
                authorNameMissing: 'Please enter an author\s name',
                deleteAllAuthorsDialogContent: 'Are you sure you want to remove all these authors?',
                deleteAuthorDialogContent: 'Are you sure you want to remove this author?',
            },
            buttons: {
                addAuthorLabel: 'Add Author',
                removeAllLabel: 'Remove all authors'
            },
            ordinalData: {
                list: [
                    'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth'
                ],
                default: 'Next',
                suffix: 'listed author'
            },
            constants: {
                autoCompleteEnterKey: -1,
                autoCompleteFirstOption: 0,
                enterKey: 'Enter',
                firstRow: 0,
                tabKey: 'Tab',
                timeoutLimit: 300
            }
        },
        files: {
            title: 'Files',
            subTitle: 'You may add up to 10 files (max 5Gb each)',
            help: {
                title: 'Files',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
            },
            limit: 10,
            filenameLimit: 45,
            formSectionPrefix: 'fileUploader',
            messages: {
                deleteAllFilesDialogContent: 'Are you sure you want to remove all these files from the upload queue?',
                deleteFileDialogContent: 'Are you sure you want to remove this file from the upload queue?',
                deleteAllFilesToolTip: 'Remove all files from the upload queue',
                deleteFileToolTip: 'Remove this file from the upload queue',
                maxFiles: 'Only [maxNumberOfFiles] files are allowed to be uploaded.',
                invalidFormatFile: 'Invalid file name.',
                invalidFormatFiles: '[numberOfRejectedFiles] have an invalid file name.',
                invalidFileLength: 'Filename is too long',
                invalidFileLengths: '[numberOfLongFiles] filenames are too long',
                existingFile: 'File has already been added.',
                existingFiles: '[numberOfExistingFiles] have already been added.',
                cancelledUpload: 'File upload cancelled.',
                noDate: 'No Date',
                uploadError: {
                    default: 'There seems to be a problem uploading file(s). Please, try again later.'
                },
                openAccessConfirmation: 'I understand that the Open Access file(s) above will be publicly available on the embargo release date. Closed Access file(s) will not be publicly available.'
            },
            fields: {
                filenameRestrictions: (
                    <div className="columns file-instructions">
                        <div className="column">
                            <h3>File upload restrictions</h3>
                            <div>
                                Please ensure your files:
                                <ul>
                                    <li>begin with a letter and are less than 45 characters long</li>
                                    <li>contain only upper and lowercase alphanumeric characters, and underscores</li>
                                    <li>have only a single period which precedes the file extension: “.pdf”</li>
                                    <li>are uploaded individually and not inside a folder</li>
                                </ul>
                            </div>
                        </div>
                        <div className="column upload-instructions">
                            <FontIcon
                                className="material-icons">cloud_upload</FontIcon>
                            <p>Click here to select files, or drag files into this area to upload</p>
                        </div>
                    </div>
                ),
                fileAccess: 'fileAccess',
                datepickerAccess: 'accessDate',
                selectField: {
                    openAccessValue: 'Open Access',
                    closedAccessValue: 'Closed Access',
                    initialValue: 'Select access conditions'
                }
            },
            list: {
                filenameLabel: 'Filename',
                fileAccessLabel: 'Access conditions',
                embargoDateLabel: 'Embargo release date'
            },
            constants: {
                openAccessId: 9,
                closedAccessId: 8,
                completed: 100
            }
        }
    }
};


