import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TabContainer from 'modules/Admin/components/TabContainer';

import { JournalDetailsContext } from '../JournalDataContext';
import ViewRow from './ViewRow';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const TabbedFields = ({ tabId, tabTitle, tabContent: contentConfig, data }) => {
    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down('xs'));
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentTabValue, setCurrentTabValue] = React.useState('0');
    const handleTabChange = (event, value) => setCurrentTabValue(value);
    const multipleData = data.length > 1;
    const tabStyle = isSmDown && {
        // eslint-disable-next-line no-nested-ternary
        maxWidth: multipleData ? 'calc((100vw - 68px) * 0.67)' : isXsDown ? '100%' : '50%',
        width: '100%',
    };
    return (
        <Grid container style={{ marginTop: 8 }}>
            <Grid item xs={12}>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    textColor="primary"
                    value={currentTabValue}
                    scrollButtons={isSmDown && multipleData ? 'on' : 'off'}
                    variant={isSmDown && multipleData ? 'scrollable' : 'standard'}
                >
                    {data.map((tab, index) => (
                        <Tab
                            data-testid={`${tabId}-${index}-heading`}
                            id={`${tabId}-${index}-heading`}
                            key={`${tabId}-${index}`}
                            label={tab[tabTitle]}
                            value={String(index)}
                            style={{ ...tabStyle }}
                        />
                    ))}
                </Tabs>
                {data.map((tab, index) => (
                    <TabContainer
                        currentTab={currentTabValue}
                        key={`${tabId}-${index}-content`}
                        tabbed
                        value={String(index)}
                    >
                        <StandardCard noHeader>
                            <JournalDetailsContext.Provider
                                value={{
                                    journalDetails: tab,
                                }}
                            >
                                {contentConfig.rows.map((field, index) => {
                                    return (
                                        <ViewRow
                                            viewRowId={`${tabId}-view-row-${index}`}
                                            key={`${tabId}-${index}`}
                                            fields={field}
                                        />
                                    );
                                })}
                            </JournalDetailsContext.Provider>
                        </StandardCard>
                    </TabContainer>
                ))}
            </Grid>
        </Grid>
    );
};

TabbedFields.propTypes = {
    data: PropTypes.array,
    rows: PropTypes.array,
    tabContent: PropTypes.object,
    tabId: PropTypes.string,
    tabTitle: PropTypes.string,
    tabs: PropTypes.array,
};

export default TabbedFields;
