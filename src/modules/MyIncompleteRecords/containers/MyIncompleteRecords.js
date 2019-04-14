import {connect} from 'react-redux';
import {locale} from 'locale';
import MyIncompleteRecords from '../components/MyIncompleteRecords';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';
import {routes} from 'config';

const mapStateToProps = (state) => {
    return {
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('accountReducer'),
        ...state.get('publicationsReducer'),
        localePages: locale.pages.incompletePublications,
        thisUrl: routes.pathConfig.records.incomplete,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let incompleteResearchContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecords);
incompleteResearchContainer = withRouter(incompleteResearchContainer);
export default incompleteResearchContainer;
