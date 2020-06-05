import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

export class ContributorsEditor extends PureComponent {
    static propTypes = {
        author: PropTypes.object,
        canEdit: PropTypes.bool,
        classes: PropTypes.object,
        contributorEditorId: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        editMode: PropTypes.bool,
        hideDelete: PropTypes.bool,
        hideReorder: PropTypes.bool,
        input: PropTypes.object,
        isNtro: PropTypes.bool,
        locale: PropTypes.object,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        required: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
    };

    static defaultProps = {
        canEdit: false,
        editMode: false,
        hideDelete: false,
        hideReorder: false,
        isNtro: false,
        locale: {
            errorTitle: 'Error',
            errorMessage: 'Unable to add an item with the same identifier.',
        },
        showContributorAssignment: false,
        showIdentifierLookup: false,
        showRoleInput: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            contributors: this.getContributorsFromProps(props),
            errorMessage: '',
            isCurrentAuthorSelected: false,
            contributorIndexSelectedToEdit: null,
        };
    }

    componentWillUpdate = (nextProps, nextState) => {
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(nextState.contributors);
        }
    };

    getContributorsFromProps = props => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    addContributor = contributor => {
        const index =
            this.state.contributorIndexSelectedToEdit !== null
                ? this.state.contributorIndexSelectedToEdit
                : this.state.contributors.length;

        if (index < this.state.contributors.length && this.props.canEdit) {
            const isEditedContributorAuthorIdInTheList =
                this.state.contributors.filter(
                    (item, itemIndex) =>
                        !!contributor.aut_id && item.aut_id === contributor.aut_id && index !== itemIndex,
                ).length > 0;
            if (isEditedContributorAuthorIdInTheList) {
                this.setState({
                    errorMessage: this.props.locale.errorMessage,
                });
                return;
            }
        } else if (
            this.state.contributors.filter(item => {
                return !!contributor.aut_id && item.aut_id === contributor.aut_id;
            }).length > 0
        ) {
            this.setState({
                errorMessage: this.props.locale.errorMessage,
            });
            return;
        }

        const isContributorACurrentAuthor =
            this.props.author && contributor.uqIdentifier === `${this.props.author.aut_id}`;
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                {
                    ...contributor,
                    disabled:
                        this.props.editMode && !isContributorACurrentAuthor && !!parseInt(contributor.uqIdentifier, 10),
                    selected: isContributorACurrentAuthor,
                    authorId: isContributorACurrentAuthor ? this.props.author.aut_id : null,
                    required: false,
                },
                ...this.state.contributors.slice(index + 1),
            ],
            errorMessage: '',
            isCurrentAuthorSelected: this.state.isCurrentAuthorSelected || isContributorACurrentAuthor,
            contributorIndexSelectedToEdit: null,
        });
    };

    moveUpContributor = (contributor, index) => {
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor,
                nextContributor,
                ...this.state.contributors.slice(index + 1),
            ],
        });
    };

    moveDownContributor = (contributor, index) => {
        if (index === this.state.contributors.length - 1) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor,
                contributor,
                ...this.state.contributors.slice(index + 2),
            ],
        });
    };

    deleteContributor = (contributor, index) => {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index),
            isCurrentAuthorSelected:
                this.state.isCurrentAuthorSelected &&
                this.props.author &&
                contributor.aut_id !== this.props.author.aut_id,
        });
    };

    deleteAllContributors = () => {
        this.setState({
            contributors: [],
            isCurrentAuthorSelected: false,
        });
    };

    assignContributor = index => {
        const newContributors = this.state.contributors.map((item, itemIndex) => ({
            ...item,
            selected: !item.selected && index === itemIndex,
            authorId: index === itemIndex && this.props.author ? this.props.author.aut_id : null,
        }));

        this.setState({
            contributors: newContributors,
        });
    };

    selectContributor = index => {
        let searchQuery = '';
        this.setState(prevState => ({
            contributors: prevState.contributors.map((contributor, itemIndex) => {
                const isEditedContributor = index === itemIndex;
                searchQuery =
                    isEditedContributor &&
                    (contributor.aut_id === 0 || !contributor.uqUsername || contributor.uqUsername === '0')
                        ? contributor.nameAsPublished
                        : '';
                return {
                    ...contributor,
                    selected: isEditedContributor,
                    uqUsername: searchQuery ? searchQuery : contributor.uqUsername,
                };
            }),
            contributorIndexSelectedToEdit: index,
        }));
    };

    renderContributorRows = () => {
        const {
            contributorEditorId,
            canEdit,
            disabled,
            hideDelete,
            hideReorder,
            locale,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const { contributors, isCurrentAuthorSelected } = this.state;
        return contributors.map((contributor, index) => (
            <ContributorRow
                {...(locale.row || {})}
                canEdit={canEdit}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                contributor={contributor}
                contributorSuffix={locale.contributorSuffix}
                disabled={disabled}
                hideDelete={hideDelete}
                hideReorder={hideReorder}
                index={index}
                className={'ContributorRow'}
                key={`ContributorRow_${index}`}
                onSelect={!canEdit ? this.assignContributor : null}
                onEdit={this.selectContributor}
                onDelete={this.deleteContributor}
                onMoveDown={this.moveDownContributor}
                onMoveUp={this.moveUpContributor}
                required={contributor.required}
                enableSelect={showContributorAssignment && !isCurrentAuthorSelected}
                showIdentifierLookup={showIdentifierLookup}
                showRoleInput={showRoleInput}
                contributorRowId={`${contributorEditorId}-list-row`}
            />
        ));
    };

    renderContributorForm = (editProps = {}) => {
        const { contributorIndexSelectedToEdit } = this.state;
        const contributor = this.state.contributors[contributorIndexSelectedToEdit];
        const formProps = {
            ...this.props,
            ...editProps,
            isContributorAssigned: !!this.state.contributors.length,
            locale: (this.props.locale.form || {}).locale,
            contributor,
            displayCancel: this.props.canEdit, // admin can cancel and clear the edit form
            canEdit: this.props.canEdit,
        };

        return (
            <ContributorForm
                key={this.state.contributorIndexSelectedToEdit}
                onSubmit={this.addContributor}
                contributorFormId={this.props.contributorEditorId}
                {...formProps}
            />
        );
    };

    render() {
        const {
            classes,
            contributorEditorId,
            disabled,
            editMode,
            hideDelete,
            isNtro,
            meta,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const { contributors, errorMessage, contributorIndexSelectedToEdit } = this.state;

        let error = null;
        if ((meta || {}).error) {
            error =
                !!meta.error.props &&
                React.Children.map(meta.error.props.children, (child, index) => {
                    return child.type ? React.cloneElement(child, { key: index }) : child;
                });
        }

        return (
            <div className={'contributorEditor'} id={`${contributorEditorId}-list-editor`}>
                <Grid container spacing={1}>
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert title={this.props.locale.errorTitle} message={errorMessage} type="warning" />
                        </Grid>
                    )}
                    {!editMode && (
                        <Grid item xs={12}>
                            {this.renderContributorForm()}
                        </Grid>
                    )}
                </Grid>
                {contributors.length > 0 && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <List style={{ marginBottom: 0 }}>
                                <ContributorRowHeader
                                    {...(this.props.locale.header || {})}
                                    disabled={disabled}
                                    hideDelete={hideDelete}
                                    isInfinite={contributors.length > 3}
                                    isNtro={isNtro}
                                    onDeleteAll={this.deleteAllContributors}
                                    showContributorAssignment={showContributorAssignment}
                                    showIdentifierLookup={showIdentifierLookup}
                                    showRoleInput={showRoleInput}
                                />
                            </List>
                            <List
                                classes={{
                                    root: `ContributorList ${classes.list} ${
                                        contributors.length > 3 ? classes.scroll : ''
                                    }`,
                                }}
                            >
                                {this.renderContributorRows()}
                            </List>
                            {editMode && contributorIndexSelectedToEdit !== null && (
                                <div style={{ marginTop: 24 }}>
                                    {this.renderContributorForm({
                                        disableNameAsPublished: true,
                                        enableUqIdentifierOnAffiliationChange: false,
                                    })}
                                </div>
                            )}
                        </Grid>
                    </Grid>
                )}
                {(meta || {}).error && (
                    <Typography color="error" variant="caption">
                        {error || meta.error}
                    </Typography>
                )}
            </div>
        );
    }
}

export const mapStateToProps = state => ({
    author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
});

export const styles = () => ({
    list: {
        width: '100%',
        margin: '0',
        maxHeight: 225,
        overflow: 'hidden',
        marginBottom: 16,
    },
    scroll: {
        overflowY: 'scroll',
    },
});

export default withStyles(styles)(connect(mapStateToProps)(ContributorsEditor));
