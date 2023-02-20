import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Link from '@mui/icons-material/Link';
import LinkOff from '@mui/icons-material/LinkOff';
import { locale } from 'locale';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    success: {
        color: ((theme.palette || {}).success || {}).light,
    },
    error: {
        color: ((theme.palette || {}).error || {}).light,
    },
});

export class OfflineSnackbar extends PureComponent {
    static propTypes = {
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            open: !navigator.onLine,
            online: navigator.onLine,
        };
    }

    componentDidMount() {
        window.addEventListener('online', this.updateOnlineState);
        window.addEventListener('offline', this.updateOnlineState);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.updateOnlineState);
        window.removeEventListener('offline', this.updateOnlineState);
    }

    updateOnlineState = () => {
        this.setState({ open: true, online: navigator.onLine });
    };

    renderMessage = (message, icon) => {
        return (
            <Grid container alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
                <Grid item xs />
                <Grid item style={{ marginRight: 24 }}>
                    {icon}
                </Grid>
                <Grid item>{message}</Grid>
                <Grid item xs />
            </Grid>
        );
    };

    handleRequestClose = reason => {
        // MUI hack to prevent the snackbar from being hidden by clicking/touchTapping away
        if (reason !== 'clickaway') {
            this.setState({ open: false });
        }
    };

    render() {
        const { classes } = this.props;
        const txt = locale.global.offlineSnackbar;
        const snackbarProps = this.state.online
            ? { ...txt.online, message: this.renderMessage(txt.online.message, <Link className={classes.success} />) }
            : {
                  ...txt.offline,
                  message: this.renderMessage(txt.offline.message, <LinkOff className={classes.error} />),
              };

        return (
            <div className="offlineSnackbar">
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    onClose={this.handleRequestClose}
                    message={snackbarProps.message}
                    autoHideDuration={snackbarProps.autoHideDuration}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(OfflineSnackbar);
