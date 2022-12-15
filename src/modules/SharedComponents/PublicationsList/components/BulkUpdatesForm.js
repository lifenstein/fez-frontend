import React from 'react';
import PropTypes from 'prop-types';

import {
    ChangeAuthorIdForm,
    ChangeDisplayTypeForm,
    ChangeSearchKeyValueForm,
    CopyToOrRemoveFromCollectionForm,
    CreateOrUpdateDoiForm,
    CopyToCommunityForm,
} from './BulkUpdatesForms';
import {
    BUA_CHANGE_DISPLAY_TYPE,
    BUA_CHANGE_SEARCH_KEY_VALUE,
    BUA_CHANGE_AUTHOR_ID,
    BUA_COPY_TO_COLLECTION,
    BUA_REMOVE_FROM_COLLECTION,
    BUA_CREATE_OR_UPDATE_DOI,
    BUA_COPY_TO_COMMUNITY,
    BUA_REMOVE_FROM_COMMUNITY,
} from 'config/bulkUpdates';

const BulkActionForms = {
    [BUA_CHANGE_AUTHOR_ID]: ChangeAuthorIdForm,
    [BUA_CHANGE_DISPLAY_TYPE]: ChangeDisplayTypeForm,
    [BUA_CHANGE_SEARCH_KEY_VALUE]: ChangeSearchKeyValueForm,
    [BUA_COPY_TO_COLLECTION]: CopyToOrRemoveFromCollectionForm,
    [BUA_REMOVE_FROM_COLLECTION]: CopyToOrRemoveFromCollectionForm,
    [BUA_CREATE_OR_UPDATE_DOI]: CreateOrUpdateDoiForm,
    [BUA_COPY_TO_COMMUNITY]: CopyToCommunityForm,
    [BUA_REMOVE_FROM_COMMUNITY]: CopyToCommunityForm,
};

export const BulkUpdatesForm = ({ selectedAction, recordsSelected, onCancel }) => {
    const BulkUpdateForm = BulkActionForms[selectedAction];
    return (
        <BulkUpdateForm
            recordsSelected={recordsSelected}
            onCancel={onCancel}
            {...(selectedAction === BUA_REMOVE_FROM_COLLECTION || selectedAction === BUA_REMOVE_FROM_COMMUNITY
                ? { isRemoveFrom: true }
                : {})}
        />
    );
};

BulkUpdatesForm.propTypes = {
    selectedAction: PropTypes.string,
    recordsSelected: PropTypes.object,
    onCancel: PropTypes.func,
};

export default React.memo(BulkUpdatesForm);
