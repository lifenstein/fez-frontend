import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: () => [
        {
            title: 'Community Title',
            groups: [['rek_title']],
        },
        {
            title: 'Community Description',
            groups: [['rek_description']],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
    ],
};

export const validateCommunity = () => ({});
