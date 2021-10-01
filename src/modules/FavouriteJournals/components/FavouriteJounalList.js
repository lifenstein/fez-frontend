import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';
import { PublicationsListPaging } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';

export const FavouriteJournalList = () => {
    const txt = locale.components.favouriteJournals.favouriteJournalsList;

    const journalsListLoading = useSelector(state => state.get('favouriteJournalsReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('favouriteJournalsReducer').journalsList);
    const journalsListLoaded = useSelector(state => state.get('favouriteJournalsReducer').journalsListLoaded);
    const journalsListError = useSelector(state => state.get('favouriteJournalsReducer').journalsListError);

    if (!journalsListLoaded) {
        return <div />;
    }

    if (!journalsList || (!!journalsList && journalsList.length === 0)) {
        return 'No journals found';
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs sm md={12}>
                <StandardCard noHeader>
                    <Grid container spacing={2}>
                        {!!journalsListLoading && (
                            <Grid item xs={12}>
                                <InlineLoader message={txt.loadingMessage} />
                            </Grid>
                        )}
                        {!!journalsListError && (
                            <Grid item xs={12}>
                                <Alert {...journalsListError} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <PublicationsListSorting
                                canUseExport
                                pagingData={{ total: 5 }}
                                sortBy="created_date"
                                sortDirection="Desc"
                                pageSize={10}
                            />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 10, current_page: 1 }}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <JournalsList journals={journalsList.data} />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};

export default React.memo(FavouriteJournalList);
