import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import YearCitationView from './YearCitationView';

export default class GenericDocumentCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    _checkFullStop = (key) => {
        if(key) {
            return key.substr(key.length - 1) === '.' ? key : key + '.';
        } else{
            return null;
        }
    };

    render() {
        const genericDocument = {
            id: this.props.publication.rek_pid,
            publisher: this._checkFullStop(this.props.publication.fez_record_search_key_publisher ? this.props.publication.fez_record_search_key_publisher.rek_publisher : null),
            title: this._checkFullStop(this.props.publication ? this.props.publication.rek_title : null)
        };

        // eSpace citation view for Generic article
        // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Publisher| |.}

        return (
            <div className="citationContent citationGenericDocument">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>
                <AuthorsCitationView publication={this.props.publication}/>
                <YearCitationView publication={this.props.publication}/>.
                <span className="citationTitle"><i> {genericDocument.title}</i></span>
                {
                    genericDocument.publisher &&
                    <span className="citationPublisher"> {genericDocument.publisher}</span>
                }
            </div>
        );
    }
}
