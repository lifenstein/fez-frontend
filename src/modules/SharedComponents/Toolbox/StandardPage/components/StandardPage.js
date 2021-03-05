import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const styles = theme => ({
    layoutCard: {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
    },
    layoutTitle: {
        overflowWrap: 'break-word !important',
        maxWidth: 1200,
        width: '90%',
        margin: '12px auto',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 12px auto',
        },
    },
    helpIcon: {
        position: 'absolute',
        right: '10px',
    },
});

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        help: PropTypes.object,
        children: PropTypes.any,
        classes: PropTypes.object,
        standardPageId: PropTypes.string,
    };

    render() {
        const { classes, title, children, help, standardPageId } = this.props;
        return (
            <Grid container className="StandardPage" id={standardPageId} data-testid={standardPageId}>
                {title && (
                    <Grid item xs>
                        <Typography
                            className={classes.layoutTitle}
                            color="primary"
                            component="h2"
                            id="page-title"
                            data-testid="page-title"
                            variant="h4"
                        >
                            {title}
                        </Typography>
                    </Grid>
                )}
                {help && (
                    <div className={classes.helpIcon}>
                        <HelpIcon {...help} />
                    </div>
                )}
                <Grid item xs={12} />
                <Grid item className={classes.layoutCard}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

const StyledPage = withStyles(styles, { withTheme: true })(Page);
const StandardPage = props => <StyledPage {...props} />;
export default StandardPage;
