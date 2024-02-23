export const controlledVocabConfig = {
    addNewVocabularyText: 'Add New Controlled Vocabulary',
    addNewCollectionText: 'Add New Collection',
    collapseSwitchText: 'Auto-close other expanded',
    viewControlledVocabTitle: 'Explore',
    viewControlledVocabText: 'View',
    vocabCountTitle: (total, parentTitle, extraPath = []) => {
        let ret = `Displaying ${total} controlled vocabularies`;
        let breadCrumb = parentTitle;
        for (let i = 0; i < extraPath.length; i++) {
            breadCrumb += ' > ' + extraPath[i].title;
        }

        ret += breadCrumb ? ' of: ' + breadCrumb : '';
        return ret;
    },
    collectionCountTitle: (start, end, total, community) =>
        `Displaying ${start} to ${end} of ${total} child controlled vocabularies for '${community}'`,
    formatCreationDate: date => `Created: ${date}`,
    formatUpdatedDate: date => `Updated: ${date}`,
};
