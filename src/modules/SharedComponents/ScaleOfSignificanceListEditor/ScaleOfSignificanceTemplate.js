import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { numberToWords, SIGNIFICANCE_MAP } from 'config/general';
import ReactHtmlParser from 'react-html-parser';

export const ScaleOfSignificanceTemplate = ({ item }) => {
    const wrappedAuthor = `(${item.author.rek_author})`;
    // eslint-disable-next-line camelcase
    const authorNameIfKnown = <>{!!item.author?.rek_author ? wrappedAuthor : ''}</>;
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body2" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                    {numberToWords(item.id + 1)} listed author {authorNameIfKnown}
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="body2" id={`scale-item-${item.id}`}>
                    {SIGNIFICANCE_MAP[item.key] || 'Missing'}
                </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Typography variant="body2" component={'span'} id={`statement-item-${item.id}`}>
                    {ReactHtmlParser(item.value.plainText || item.value.htmlText || '')}
                </Typography>
            </Grid>
        </Grid>
    );
};

ScaleOfSignificanceTemplate.propTypes = {
    item: PropTypes.object,
};
