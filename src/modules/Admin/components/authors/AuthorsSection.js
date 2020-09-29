import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { authorsParams } from 'modules/Admin/helpers';

export const AuthorsSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(adminInterfaceConfig[record.rek_display_type].authors(authorsParams(record)));

    return <Section cards={cards.current} disabled={disabled} />;
};

AuthorsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorsSection);
