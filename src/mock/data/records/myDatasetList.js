import { hydrateMockSearchList } from '../../../helpers/general';

const myDatasetList = {
    "total": 2,
    "took": 15,
    "per_page": 20,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [
        {
            "rek_pid": "UQ:418081",
            "rek_title": "Appendix: Comprehensive design temperatures for Queensland.",
            "rek_description":
                "Data and analysis for comprehensive design temperatures for 225 Queensland locations. Appendix supports the article 'New air conditioning design temperatures for Queensland, Australia' which is published along with the dataset, with permission.<br />",
            "rek_display_type": 371,
            "rek_status": 2,
            "rek_date": "2017-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 38999,
            "rek_created_date": "2017-01-17T10:00:57Z",
            "rek_updated_date": "2018-04-10T05:11:30Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"author_id_link\" title=\"Browse by Author ID for Peterson, Eric\" href=\"/list/author_id/2498/\">Peterson, Eric</a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Williams, Neville\" href=\"/list/author/Williams%2C+Neville/\">Williams, Neville</a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Gilbert, Dale\" href=\"/list/author/Gilbert%2C+Dale/\">Gilbert, Dale</a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Bremhorst, Klaus\" href=\"/list/author_id/266/\">Bremhorst, Klaus</a> (<span class=\"citation_date\">2017</span>): <a class=\"citation_title\" title=\"Click to view Data Collection: Appendix: Comprehensive design temperatures for Queensland.\" href=\"/view/UQ:418081\">Appendix: Comprehensive design temperatures for Queensland.</a>. <span class=\"citation_publisher\">The University of Queensland</span>. <span class=\"citation_ands_collection_type\">Dataset</span>.",
            "rek_genre": "Dataset Collection",
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "fez_record_search_key_access_conditions": {
                "rek_access_conditions": "453619",
                "rek_access_conditions_lookup": "Open Access"
            },
            "fez_record_search_key_additional_notes":
                "From: Matt Dillon (AIRAH) [mailto:matt@airah.org.au] Sent: Monday, 16 January 2017 10:56 PM To: Eric Peterson Subject: RE: [ASHRAE-TC4.2] FW: TC 4.2 might be interested Hi Eric, It’s fine for you to put online on your site. Thanks for asking. Matt Matthew Dillon Communications Manager AIRAH – National office Level 3/1 Elizabeth St Melbourne Vic 3000 T: (03) 8623 3000 D: (03) 8623 3009 www.airah.org.au matt@airah.org.au",
            "fez_record_search_key_ands_collection_type": {
                "rek_ands_collection_type": "453616",
                "rek_ands_collection_type_lookup": "Dataset"
            },
            "fez_record_search_key_author": ["Peterson, Eric", "Williams, Neville", "Gilbert, Dale", "Bremhorst, Klaus"],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 2498,
                    "rek_author_id_lookup": "Peterson, Eric L."
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id": 0,
                },
                {
                    "rek_author_id_order": 4,
                    "rek_author_id_lookup": "Bremhorst, Klaus"
                }
            ],
            "fez_record_search_key_author_role": [
                "Postdoctoral Research Fellow, BERU",
                "Manager, Thermal Comfort Initiative",
                "Director, Built Environment Research Unit",
                "Professor Emertitus, Mechanical Engineering",
            ],
            "fez_record_search_key_contact_details_email": ["e.peterson@uq.edu.au"],
            "fez_record_search_key_contributor": ["Peterson, Eric"],
            "fez_record_search_key_contributor_id": [
                {
                    "rek_contributor_id": 2498,
                    "rek_contributor_id_lookup": "Peterson, Eric L."
                }
            ],
            "fez_record_search_key_file_attachment_name": [
                "ComprehensiveDesignTemperaturesQld.pdf",
                "FezACML_ComprehensiveDesignTemperaturesQld.pdf.xml",
                "FezACML_UQ_418081.xml",
                "presmd_ComprehensiveDesignTemperaturesQld.xml",
            ],
            "fez_record_search_key_isdatasetof": [
                {
                    "rek_isdatasetof": "UQ:418885",
                    "datasetSiblings": [
                        {
                            "rek_pid": "UQ:4",
                            "rek_title": "Some other record which shares this isdatasetof",
                        },
                    ],
                    "parent": {
                        "rek_pid": "UQ:418885",
                        "rek_display_type": "371",
                        "rek_title": "New air conditioning design temperatures for Queensland, Australia",
                        "fez_record_search_key_doi": null,
                    },
                    "rek_isdatasetof_lookup": "New air conditioning design temperatures for Queensland, Australia"
                }
            ],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:289097",
                    "rek_ismemberof_lookup": "Research Data Collections"
                }
            ],
            "fez_record_search_key_keywords": ["queensland", "airconditioning"],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_license": {
                "rek_license": 453701,
                "rek_license_lookup": "Permitted Re-use with Acknowledgement"
            },
            "fez_record_search_key_project_description":
                "Airconditioning project within the Queensland Government Built Environment Research Unit (BERU). Eric Peterson (postdoc) was mentored by UQ Professor Emeritus Klaus Bremhorst in the research.",
            "fez_record_search_key_project_name": "New air conditioning design temperatures for Queensland, Australia",
            "fez_record_search_key_publisher": "The University of Queensland",
            "fez_record_search_key_rights": "2017, The University of Queensland",
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 452674,
                    "rek_subject_lookup": "120101 Architectural Design"
                },
                {
                    "rek_subject": 451968,
                    "rek_subject_lookup": "040105 Climatology (excl.Climate Change Processes)"
                }
            ],
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:418081",
                    "dsi_dsid": "ComprehensiveDesignTemperaturesQld.pdf",
                    "dsi_embargo_date": "2017-02-08",
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 261026
                },
                {
                    "dsi_pid": "UQ:418081",
                    "dsi_dsid": "FezACML_ComprehensiveDesignTemperaturesQld.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - ComprehensiveDesignTemperaturesQld.pdf",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 58
                },
                {
                    "dsi_pid": "UQ:418081",
                    "dsi_dsid": "FezACML_UQ_418081.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for PID - UQ:418081",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 3705
                },
                {
                    "dsi_pid": "UQ:418081",
                    "dsi_dsid": "presmd_ComprehensiveDesignTemperaturesQld.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "PresMD for datastream - ComprehensiveDesignTemperaturesQld.pdf",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 21655
                }
            ],
            "fez_record_search_key_has_related_datasets": [
                {
                    "rek_has_related_datasets": "UQ:418885",
                    "rek_has_related_datasets_lookup": "New air conditioning design temperatures for Queensland, Australia"
                }
            ],
            "rek_status_lookup": "Published",
            "rek_object_type_lookup": "Record",
            "rek_display_type_lookup": "Data Collection",
        },
    ],
    "filters": {
        "facets": {
            "Scopus document type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Display type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": 371,
                        "doc_count": 2
                    }
                ]
            },
            "Keywords": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "Radiation Chemistry",
                        "doc_count": 1
                    },
                    {
                        "key": "Solar Activity",
                        "doc_count": 1
                    },
                    {
                        "key": "airconditioning",
                        "doc_count": 1
                    },
                    {
                        "key": "queensland",
                        "doc_count": 1
                    }
                ]
            },
            "Scopus document type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Subject (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "040105 Climatology (excl.Climate Change Processes)",
                        "doc_count": 1
                    },
                    {
                        "key": "090605 Photodetectors, Optical Sensors and Solar Cells",
                        "doc_count": 1
                    },
                    {
                        "key": "091305 Energy Generation, Conversion and Storage Engineering",
                        "doc_count": 1
                    },
                    {
                        "key": "120101 Architectural Design",
                        "doc_count": 1
                    },
                    {
                        "key": "120104 Architectural Science and Technology (incl. Acoustics, Lighting, Structure and Ecologically Sustainable Design)",
                        "doc_count": 1
                    }
                ]
            },
            "Collection (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "Research Data Collections",
                        "doc_count": 2
                    },
                    {
                        "key": "School of Civil Engineering Publications",
                        "doc_count": 1
                    }
                ]
            },
            "Year published": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "2014",
                        "doc_count": 1
                    },
                    {
                        "key": "2017",
                        "doc_count": 1
                    }
                ]
            },
            "Author (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "Peterson, Eric L.",
                        "doc_count": 2
                    },
                    {
                        "key": "Bremhorst, Klaus",
                        "doc_count": 1
                    }
                ]
            },
            "Subject": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": 451968,
                        "doc_count": 1
                    },
                    {
                        "key": 452345,
                        "doc_count": 1
                    },
                    {
                        "key": 452411,
                        "doc_count": 1
                    },
                    {
                        "key": 452674,
                        "doc_count": 1
                    },
                    {
                        "key": 452677,
                        "doc_count": 1
                    }
                ]
            },
            "Journal name": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Collection": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "UQ:289097",
                        "doc_count": 2
                    },
                    {
                        "key": "UQ:195545",
                        "doc_count": 1
                    }
                ]
            },
            "Author": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": 2498,
                        "doc_count": 2
                    },
                    {
                        "key": 266,
                        "doc_count": 1
                    }
                ]
            },
            "Genre": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Subtype": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Display type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "Data Collection",
                        "doc_count": 2
                    }
                ]
            }
        }
    }
};
export default hydrateMockSearchList(myDatasetList);
