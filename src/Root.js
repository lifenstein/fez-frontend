import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
// MUI1
import { mui1theme } from 'config';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import ThemeProvider from '@mui/styles/ThemeProvider';
import JssProvider from 'react-jss/lib/JssProvider';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

// Top level "pages"
import { App } from 'modules/App';
import { ScrollToTop } from 'modules/SharedComponents/Toolbox/ScrollToTop';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <StyledEngineProvider injectFirst>
                    <JssProvider generateClassName={generateClassName}>
                        <ThemeProvider theme={mui1theme}>
                            <MuiThemeProvider theme={mui1theme}>
                                <Switch>
                                    <Route component={App} />
                                </Switch>
                            </MuiThemeProvider>
                        </ThemeProvider>
                    </JssProvider>
                </StyledEngineProvider>
            </ScrollToTop>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
