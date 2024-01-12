import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { userIsAdmin } from 'hooks';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Typography from '@mui/material/Typography';
import { controlledVocabConfig } from 'config';

import * as actions from 'actions/viewControlledVocab';
import locale from 'locale/components';
import { useDispatch, useSelector } from 'react-redux';

import { VocabTable } from './components/VocabTable.js';

export const ControlledVocabularies = () => {
    const adminUser = userIsAdmin();
    const dispatch = useDispatch();
    const vocabList = useSelector(state => state.get('viewVocabReducer').vocabList);
    const loadingVocab = useSelector(state => state.get('viewVocabReducer').loadingVocab);
    const totalRecords = useSelector(state => state.get('viewVocabReducer').totalRecords);
    const startRecord = useSelector(state => state.get('viewVocabReducer').startRecord);
    const endRecord = useSelector(state => state.get('viewVocabReducer').endRecord);
    const loadingVocabError = useSelector(state => state.get('viewVocabReducer').loadingVocabError);

    React.useEffect(() => {
        dispatch(actions.loadControlledVocabList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = locale.components.controlledVocabularyCollections;

    const labels = txt.columns.labels;

    const sortedList = [...vocabList];
    return (
        <StandardPage title={txt.title.controlledVocabulary}>
            {!!!loadingVocabError && (
                <React.Fragment>
                    <StandardCard noHeader style={{ marginTop: 10 }}>
                        {!!!loadingVocab && (
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, marginBottom: '10px' }}
                                id="total-vocab"
                                data-testid="total-vocab"
                            >
                                {controlledVocabConfig.vocabCountTitle(startRecord, endRecord, totalRecords)}
                            </Typography>
                        )}

                        {sortedList.length > 0 ? (
                            <VocabTable records={sortedList} labels={labels} conf={txt} adminUser={adminUser} />
                        ) : (
                            <InlineLoader loaderId={'vocab-page-loading'} message={txt.loading.message} />
                        )}
                    </StandardCard>
                </React.Fragment>
            )}
            {!!loadingVocabError && (
                <Grid item xs={12} style={{ marginTop: 10 }}>
                    <Alert title="An error has occurred" message={loadingVocabError.message} type="info_outline" />
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(ControlledVocabularies);
