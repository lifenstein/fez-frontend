import React from 'react';
import { useLocation } from 'react-router';
import deparam from 'can-deparam';

export const useJournalSearchInterfaceState = initialState => {
    const [showKeywordsBrowser, setKeywordsBrowserVisibility] = React.useState(initialState);
    const [showJournalSearchInput, setJournalSearchInputVisibility] = React.useState(initialState);
    const [showButtons, setButtonsVisibility] = React.useState(initialState);

    const toggleKeywordsBrowser = () => setKeywordsBrowserVisibility(on => !on);
    const toggleJournalSearchInput = () => setJournalSearchInputVisibility(on => !on);
    const toggleButtons = () => setButtonsVisibility(on => !on);

    return {
        showKeywordsBrowser,
        showJournalSearchInput,
        showButtons,
        toggleJournalSearchInput,
        toggleKeywordsBrowser,
        toggleButtons,
    };
};

export const useSelectedKeywords = (initialKeywords = {}) => {
    const [selectedKeywords, setSelectedKeywords] = React.useState(initialKeywords);

    const getKeywordKey = keyword => `${keyword.type}-${keyword.text.replace(/ /g, '-')}`;

    const handleKeywordAdd = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => ({
                ...prevSelectedKeywords,
                [getKeywordKey(keyword)]: { ...keyword, id: getKeywordKey(keyword) },
            })),
        [],
    );

    const handleKeywordDelete = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => {
                const newSelectedKeywords = { ...prevSelectedKeywords };
                delete newSelectedKeywords[keyword.id];
                return { ...newSelectedKeywords };
            }),
        [],
    );

    const hasAnySelectedKeywords = Object.values(selectedKeywords).length > 0;

    return {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    };
};

export const useSelectedJournals = (state = {}) => {
    const [selectedJournals, setSelectedJournals] = React.useState(state);

    const handleSelectedJournalsChange = React.useCallback(e => {
        if (e.target.checked) {
            setSelectedJournals(current => {
                const selected = { ...current };
                selected[e.target.value] = true;
                return selected;
            });
            return;
        }

        setSelectedJournals(current => {
            const selected = [...current];
            delete selected[e.target.value];
            return selected;
        });
    }, []);

    const countSelectedJournals = () => Object.values(selectedJournals).length;

    return {
        selectedJournals,
        setSelectedJournals,
        handleSelectedJournalsChange,
        countSelectedJournals,
    };
};

export const useJournalSearchQueryParams = () => {
    const location = useLocation();
    const journalSearchQueryParams = deparam(location.search.substr(1));

    return {
        journalSearchQueryParams,
        locationKey: location.key,
    };
};
