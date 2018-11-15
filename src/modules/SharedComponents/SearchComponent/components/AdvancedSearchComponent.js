import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from '@material-ui/core/Checkbox';
import {publicationTypes} from 'config';
import {locale} from 'locale';
import * as recordForms from '../../PublicationForm/components/Forms';
import DocumentTypeField from './Fields/DocumentTypeField';
import PublicationYearRangeField from './Fields/PublicationYearRangeField';
import AdvancedSearchCaption from './AdvancedSearchCaption';
import {withStyles} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import * as validationRules from 'config/validation';

const styles = theme => ({
    sideBar: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 32,
            marginTop: -16
        }
    },
    searchButton: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 32
        }
    },
    blueButton: {
        backgroundColor: theme.palette.accent.main,
        color: theme.palette.white.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        }
    }
});

export class AdvancedSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        classes: PropTypes.object,

        fieldRows: PropTypes.array,
        docTypes: PropTypes.array,
        yearFilter: PropTypes.object,
        activeFacets: PropTypes.object,
        isOpenAccess: PropTypes.bool,
        isMinimised: PropTypes.bool,
        isLoading: PropTypes.bool,
        showUnpublishedFields: PropTypes.bool,

        // Event handlers
        onToggleSearchMode: PropTypes.func,
        onToggleMinimise: PropTypes.func,
        onToggleOpenAccess: PropTypes.func,
        onAdvancedSearchRowAdd: PropTypes.func,
        onAdvancedSearchRowRemove: PropTypes.func,
        onAdvancedSearchReset: PropTypes.func,
        updateDocTypeValues: PropTypes.func,
        updateYearRangeFilter: PropTypes.func,

        onAdvancedSearchRowChange: PropTypes.func.isRequired,
        onSearch: PropTypes.func.isRequired,
    };
    static defaultProps = {
        fieldRows: [{
            searchField: '0',
            value: '',
            label: ''
        }],
        yearFilter: {
            from: null,
            to: null,
            invalid: true
        },
        isMinimised: false,
        isOpenAccess: false,
        showUnpublishedFields: false,

        onToggleSearchMode: () => {},
        onToggleMinimise: () => {},
        onToggleOpenAccess: () => {},
        onAdvancedSearchRowAdd: () => {},
        onAdvancedSearchRowRemove: () => {},
        onAdvancedSearchReset: () => {}
    };

    constructor(props) {
        super(props);
        this.publicationTypes = publicationTypes({...recordForms});
    }

    haveAllAdvancedSearchFieldsValidated = (fieldRows) => {
        const fieldTypes = locale.components.searchComponent.advancedSearch.fieldTypes;
        return !this.props.isLoading && !this.props.yearFilter.invalid
            && (
                fieldRows
                    .reduce((errors, item) => {
                        const newErrors = fieldTypes[item.searchField].validation.map(rule => validationRules[rule](item.value));
                        return [...errors, ...newErrors];
                    }, [])
                    .filter(error => !!error)
                    .length === 0
            );
    };

    _handleAdvancedSearch = (event) => {
        if (event) event.preventDefault();
        if (event && event.key && (event.key !== 'Enter')) return;
        this.props.onSearch();
    };

    _toggleSearchMode = () => {
        if (!!this.props.onToggleSearchMode) {
            this.props.onToggleSearchMode();
        }
    };

    _toggleMinimise = () => {
        if (!!this.props.onToggleMinimise) {
            this.props.onToggleMinimise();
        }
    };

    _toggleOpenAccess = () => {
        if (!!this.props.onToggleOpenAccess) {
            this.props.onToggleOpenAccess();
        }
    };

    _handleAdvancedSearchRowChange = (index, searchRow) => {
        this.props.onAdvancedSearchRowChange(index, searchRow);
    };

    _addAdvancedSearchRow = () => {
        if (!!this.props.onAdvancedSearchRowAdd) {
            this.props.onAdvancedSearchRowAdd();
        }
    };

    _removeAdvancedSearchRow = (index) => {
        if (!!this.props.onAdvancedSearchRowRemove) {
            this.props.onAdvancedSearchRowRemove(index);
        }
    };

    _resetAdvancedSearch = () => {
        if (!!this.props.onAdvancedSearchReset) {
            this.props.onAdvancedSearchReset();
        }
    };

    render() {
        const {classes} = this.props;
        const txt = locale.components.searchComponent;
        const lastFieldAdded = [...this.props.fieldRows].pop();
        const canAddAnotherField = this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)
            && lastFieldAdded.searchField !== '0';
        const alreadyAddedFields = this.props.fieldRows.map(item => item.searchField);
        return (
            <form id="advancedSearchForm" onSubmit={this._handleAdvancedSearch} style={{padding: 12}}>
                <Grid container spacing={24}>
                    <Grid container spacing={40}>
                        <Grid item style={{flexGrow: 1, width: 1}}>
                            <Typography variant={'headline'}>{txt.advancedSearch.title}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={this._toggleMinimise}
                                tooltip={this.props.isMinimised
                                    ? txt.advancedSearch.tooltip.show
                                    : txt.advancedSearch.tooltip.hide}>
                                {
                                    !this.props.isMinimised
                                        ? <KeyboardArrowUp/>
                                        : <KeyboardArrowDown/>
                                }
                            </IconButton>
                        </Grid>
                    </Grid>
                    {
                        !this.props.isMinimised &&
                            <Fragment>
                                <Grid container>
                                    <Grid item xs={12} md={8}>
                                        {
                                            this.props.fieldRows
                                                .filter((item) => {
                                                    return item.searchField && txt.advancedSearch.fieldTypes[item.searchField].type !== null;
                                                })
                                                .map((item, index) => (
                                                    <AdvancedSearchRow
                                                        key={`advanced-search-field-${item.searchField}`}
                                                        rowIndex={index}
                                                        disabledFields={alreadyAddedFields}
                                                        onSearchRowChange={this._handleAdvancedSearchRowChange}
                                                        onSearchRowDelete={this._removeAdvancedSearchRow}
                                                        showUnpublishedFields={this.props.showUnpublishedFields}
                                                        {...item}
                                                    />
                                                ))
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={4} className={classes.sideBar}>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12}>
                                                <DocumentTypeField
                                                    docTypes={this.props.docTypes}
                                                    updateDocTypeValues={this.props.updateDocTypeValues}
                                                    disabled={this.props.isLoading}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PublicationYearRangeField
                                                    yearFilter={this.props.yearFilter}
                                                    updateYearRangeFilter={this.props.updateYearRangeFilter}
                                                    disabled={this.props.isLoading}
                                                    invalid={this.props.yearFilter.invalid}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        aria-label={txt.advancedSearch.openAccess.ariaLabel}
                                                        checked={this.props.isOpenAccess}
                                                        onChange={this._toggleOpenAccess}
                                                        disabled={this.props.isLoading} />}
                                                    label={txt.advancedSearch.openAccess.title}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={16} style={{marginTop: 24}}>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            variant={'contained'}
                                            classes={{root: classes.blueButton}}
                                            children={txt.advancedSearch.addField.title}
                                            aria-label={txt.advancedSearch.addField.aria}
                                            disabled={!canAddAnotherField}
                                            onClick={this._addAdvancedSearchRow}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            variant={'contained'}
                                            children={txt.advancedSearch.reset.title}
                                            aria-label={txt.advancedSearch.reset.aria}
                                            onClick={this._resetAdvancedSearch}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            children={txt.advancedSearch.simpleSearch.title}
                                            aria-label={txt.advancedSearch.simpleSearch.aria}
                                            onClick={this._toggleSearchMode}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Hidden smDown>
                                        <Grid item style={{flexGrow: 1, width: 1}}/>
                                    </Hidden>
                                    <Grid item  xs={12} md={4} className={classes.searchButton}>
                                        <Button
                                            variant={'contained'}
                                            children={txt.searchButtonText}
                                            aria-label={txt.searchButtonAriaLabel}
                                            type="submit"
                                            color={'primary'}
                                            fullWidth
                                            onClick={this._handleAdvancedSearch}
                                            disabled={!this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)}
                                        />
                                    </Grid>
                                </Grid>
                            </Fragment>
                    }
                    <Grid container>
                        <Grid item style={{paddingTop: 24}}>
                            <AdvancedSearchCaption {...this.props} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withStyles(styles, {withTheme: true})(AdvancedSearchComponent);

