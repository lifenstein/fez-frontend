import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

export class AdminLookupForm extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        form: PropTypes.object.isRequired,
        isMinimised: PropTypes.bool,
    };
    static defaultProps = {
        isMinimised: true,

        onToggleMinimise: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            isMinimised: props.isMinimised,
            primaryValue: '',
            secondaryValue: '',
            lookupResults: false,
        };
    }

    // toggle form open or closed
    _toggleMinimise = () => {
        this.setState({
            isMinimised: !this.state.isMinimised
        });
    };

    _handleSubmitLookup = () => {
        const lookupType = this.props.form.lookupType; // locale.components.adminLookupTools.incites.lookupType;
        const primaryValue = this.state.primaryValue;
        const secondaryValue = this.state.secondaryValue;

        if (secondaryValue !== '' && primaryValue !== '' && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupType, primaryValue, secondaryValue);
        } else if (primaryValue !== '' && this.props.actions && this.props.actions.loadAdminLookup) {
            this.props.actions.loadAdminLookup(lookupType, primaryValue); // , undefined);
        }
    };

    _handleDefaultSubmit = (event) => {
        if(event) event.preventDefault();
    };

    // update state for the form fields on input
    _onChange = (e) => {
        if (typeof e !== 'undefined') {
            this.setState({[e.target.name]: e.target.value});
        }
    };

    render() {
        const txt = {
            title: locale.components.adminLookupTools.title,
            form: this.props.form,
        };
        const { primaryValue, secondaryValue } = this.state;
        return (
            <StandardCard className="searchComponent" noHeader>
                <Grid container spacing={24}>
                    <Grid item style={{flexGrow: 1, width: 1}}>
                        <Typography variant={'headline'}>{txt.form.lookupLabel}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={this._toggleMinimise}
                            tooltip={!!this.state.isMinimised
                                ? locale.components.adminLookupTools.tooltip.show + ' for ' + txt.form.lookupLabel
                                : locale.components.adminLookupTools.tooltip.hide + ' for ' + txt.form.lookupLabel}>
                            {
                                !!this.state.isMinimised
                                    ? <KeyboardArrowDown/>
                                    : <KeyboardArrowUp/>
                            }
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container>
                    <p>{txt.form.tip}</p>
                </Grid>
                {
                    !this.state.isMinimised &&
                    <Fragment>
                        <Grid container>
                            <form onSubmit={this._handleDefaultSubmit}>

                                <div>
                                    <h4>{txt.form.primaryField.heading}</h4>
                                    <p>{txt.form.primaryField.tip}</p>
                                    <TextField
                                        fullWidth
                                        name={'primaryValue'}
                                        placeholder={txt.form.primaryField.inputPlaceholder}
                                        aria-label={txt.form.primaryField.fromAria}
                                        value={primaryValue}
                                        onChange={this._onChange}
                                        required
                                    />
                                </div>
                                {
                                    // not all forms will have a second field
                                    !!txt.form.secondaryField ?
                                        <div>
                                            <h4>{txt.form.secondaryField.heading}</h4>
                                            <p>{txt.form.secondaryField.tip}</p>
                                            <TextField
                                                fullWidth
                                                name={'secondaryValue'}
                                                placeholder={txt.form.secondaryField.inputPlaceholder}
                                                aria-label={txt.form.secondaryField.fromAria}
                                                value={secondaryValue}
                                                onChange={this._onChange}
                                            />
                                        </div>
                                        :
                                        <div>&nbsp;</div>
                                }
                                <p>{txt.form.bottomTip}</p>
                                <Button
                                    children= {txt.form.submitButtonLabel ? txt.form.submitButtonLabel : 'Submit'}
                                    variant="contained"
                                    aria-label={txt.form.submitButtonLabel}
                                    color={'primary'}
                                    onClick={() => this._handleSubmitLookup()}
                                />
                            </form>
                        </Grid>
                        {
                            !!this.state.lookupResults ?
                                <StandardCard style={{marginTop: 10}} title={locale.components.adminLookupTools.resultsLabel}>
                                    tbd
                                </StandardCard>
                                :
                                ''
                        }
                    </Fragment>
                }
            </StandardCard>
        );
    }
}
