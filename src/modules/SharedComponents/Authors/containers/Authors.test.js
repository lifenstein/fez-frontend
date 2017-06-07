jest.dontMock('../components/Authors');

import {reduxForm} from 'redux-form';
import Authors from '../components/Authors';
import React from 'react';
import PropTypes from 'prop-types';

import {mount} from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Immutable from 'immutable';

import {reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import authorsReducer from '../reducer';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let addAuthor;
let removeAuthor;
let clearAuthors;
let selectedAuthors;
let app;

describe('Authors', () => {
    beforeEach(() => {
        const store = createStore(combineReducers({form: formReducer, authors: authorsReducer}));
        addAuthor = sinon.spy();
        removeAuthor = sinon.spy();
        clearAuthors = sinon.spy();
        const authors = Immutable.fromJS([
            {'aut_id': 202, 'aut_display_name': 'Author 8'},
            {'aut_id': 263, 'aut_display_name': 'Author 9'},
            {'aut_id': 174, 'aut_display_name': 'Author 10'},
            {'aut_id': 177, 'aut_display_name': 'Author 11'}
        ]);

        selectedAuthors = Immutable.fromJS([
            {'aut_id': 202, 'aut_display_name': 'Author 8'},
            {'aut_id': 263, 'aut_display_name': 'Author 9'}
        ]);

        const props = {
            addAuthor,
            removeAuthor,
            selectedAuthors,
            clearAuthors,
            dataSource: authors,
            form: 'atestform',
            formValues: Immutable.fromJS({authorName: 177})

        };

        const muiTheme = getMuiTheme();
        const Decorated = reduxForm({ form: 'testForm' })(Authors);
        app = mount(
            <Provider store={store}>
                <Decorated {...props} />
            </Provider>,
            { context: {muiTheme},
                childContextTypes: {muiTheme: PropTypes.object}}
        );
    });

    it('renders nested components', () => {
        expect(app.find('RaisedButton').toBeDefined);
        expect(app.find('AutoCompleteSelectWrapper').toBeDefined);
    });

    it('adds an author to the list', () => {
        const input = app.find('AsyncAutoCompleteSelect');
        input.props().onChange();

        expect(addAuthor.called).toEqual(true);
        expect(addAuthor.callCount).toEqual(1);
    });

    it('removes an author from the list', () => {
        const authorRows = app.find('AuthorRow');
        expect(authorRows.length).toEqual(selectedAuthors.size);

        const selectedAuthor = app.find('AuthorRow').first();
        selectedAuthor.props().removeAuthor(0);

        expect(removeAuthor.called).toEqual(true);
        expect(removeAuthor.callCount).toEqual(1);
    });
});
