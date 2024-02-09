import React from 'react';

import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import locale from 'locale/components';
import ChildVocabDataRow from './ChildVocabDataRow';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from 'actions';
import { controlledVocabConfig } from 'config/controlledVocabConfig';
import Typography from '@mui/material/Typography';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const ChildVocabTable = ({ parentRow }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        /* istanbul ignore else */
        dispatch(
            actions.loadChildVocabList({
                pid: parentRow.cvo_id,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { openedVocabLists: existingList, loadingChildVocab } = useSelector(state =>
        state.get('viewChildVocabReducer'),
    );
    // const loadingChildVocab = useSelector(state => state.get('viewChildVocabReducer').loadingChildVocab);
    const findItem = existingList.find(em => em.data && em.data[0].cvr_parent_cvo_id === parentRow.cvo_id);
    let vocabList = [];
    let totalRecords = 0;
    if (findItem) {
        vocabList = findItem.data;
        totalRecords = findItem.total;
    }

    return (
        <Box
            sx={{
                backgroundColor: '#eee',
                padding: '20px',
                boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
            }}
            data-testid={`vocab-table-${parentRow.cvo_id}`}
            id={`vocab-table-${parentRow.cvo_id}`}
        >
            <Box sx={{ minHeight: 200, backgroundColor: '#FFF', padding: '10px' }}>
                <Grid container spacing={0}>
                    <Grid item md={12}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, marginBottom: '10px' }}
                            id={`total-vocab-${parentRow.cvo_id}`}
                            data-testid={`total-vocab-${parentRow.cvo_id}`}
                        >
                            {controlledVocabConfig.vocabCountTitle(totalRecords, parentRow.cvo_title)}
                        </Typography>
                    </Grid>
                    {/* Header Row */}
                    <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-child-header">
                        <Grid item md={1}>
                            {labels.id}
                        </Grid>
                        <Grid item md={3}>
                            {labels.title}
                        </Grid>
                        <Grid item md={3}>
                            <Box>{labels.desc}</Box>
                        </Grid>
                        <Grid item md={1}>
                            <Box>{labels.order}</Box>
                        </Grid>
                        <Grid item md={2}>
                            {labels.license}
                        </Grid>
                        <Grid item md={1}>
                            {labels.external_id}
                        </Grid>
                        <Grid item md={1}>
                            {labels.actions}
                        </Grid>
                    </Grid>
                    {/* Data Row */}
                    <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-child-body">
                        {vocabList.map(row => (
                            <ChildVocabDataRow key={row.controlled_vocab.cvo_id} row={row.controlled_vocab} />
                        ))}
                        {loadingChildVocab && (
                            <Grid item md={12}>
                                <InlineLoader
                                    loaderId="childControlledVocab-page-loading"
                                    message={txt.loading.message}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
ChildVocabTable.propTypes = {
    parentRow: PropTypes.object,
};
export default ChildVocabTable;
