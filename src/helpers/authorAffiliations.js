const MAX_TOTAL = 100000;

export const composeAuthorAffiliationProblems = record => {
    const uniqueAffiliations = record.fez_author_affiliation?.reduce(
        (accumulated, current) =>
            accumulated.includes(current.af_author_id) ? accumulated : [...accumulated, current.af_author_id],
        [],
    );

    return record.fez_record_search_key_author_id
        .filter(author => author.rek_author_id !== 0)
        .map(author => {
            const hasAffiliations = uniqueAffiliations.includes(author.rek_author_id);
            const hasOrgAffiliations =
                hasAffiliations &&
                record.fez_author_affiliation
                    ?.filter(item => item.af_author_id === author.rek_author_id)
                    ?.every(item => !!item.fez_org_structure);
            return {
                rek_author_id: author.rek_author_id,
                rek_author_id_lookup: author.rek_author_id_lookup ?? '',
                hasOrgAffiliations,
                has100pcAffiliations:
                    hasAffiliations &&
                    record.fez_author_affiliation
                        .filter(item => item.af_author_id === author.rek_author_id)
                        .reduce((accumulated, current) => accumulated + current.af_percent_affiliation, 0) >= MAX_TOTAL,
            };
        });
};
