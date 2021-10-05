import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import PropTypes from 'prop-types';

const JournalsListDataCol1 = ({ journal, index, onChange }) => {
    return (
        <Grid
            container
            spacing={1}
            direction="row"
            id={`journal-list-data-${index}`}
            alignItems="center"
            alignContent="center"
            style={{
                borderBottom: '1px dashed #e6e6e6',
                borderRight: '1px dashed #e6e6e6',
                padding: 0,
                height: 48,
                overflow: 'hidden',
            }}
        >
            <Grid item xs={1} id={`journal-list-data-select-${index}`} style={{ height: 48 }}>
                <Tooltip title={`Click to add ${journal.jnl_title} to your compare list`} placement="right">
                    <Checkbox style={{ padding: 2, marginTop: 10 }} value={journal.jnl_jid} onChange={onChange} />
                </Tooltip>
            </Grid>
            <Grid
                item
                xs={11}
                id={`journal-list-header-title-${index}`}
                style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    paddingLeft: 12,
                    paddingRight: 16,
                    lineHeight: 2,
                }}
            >
                <Tooltip title={`Click to view ${journal.jnl_title}`} placement="right">
                    <Typography
                        variant="body1"
                        component="span"
                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        <ExternalLink
                            href={`/journal/view/${journal.jnl_jid}`}
                            title={journal.jnl_title}
                            id={`${journal.jnl_jid}-${journal.jnl_title}`}
                        >
                            {journal.jnl_title}
                        </ExternalLink>
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid item xs />
        </Grid>
    );
};

JournalsListDataCol1.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func,
};

export default React.memo(JournalsListDataCol1);
