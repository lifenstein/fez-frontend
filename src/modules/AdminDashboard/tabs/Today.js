import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import locale from 'locale/components';
import * as actions from 'actions';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { LINK_UNPROCESSED_WORKS, COLOURS } from '../config';

import RibbonChartContainer from '../components/RibbonChartContainer';
import PieChartContainer from '../components/PieChartContainer';
import GaugeChartContainer from '../components/GaugeChartContainer';
import QuickLinkContainer from '../components/QuickLinkContainer';
import VisualisationSystemAlerts from '../components/visualisations/VisualisationSystemAlerts';
import VisualisationWorks from '../components/visualisations/VisualisationWorks';
import VisualisationOpenAccess from '../components/visualisations/VisualisationOpenAccess';

const Today = () => {
    const txt = locale.components.adminDashboard.today;
    const dispatch = useDispatch();
    const {
        // adminDashboardConfigData,
        adminDashboardConfigLoading,
        adminDashboardConfigSuccess,
        adminDashboardConfigError,
    } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const { adminDashboardTodayData, adminDashboardTodayLoading, adminDashboardTodaySuccess } = useSelector(state =>
        state.get('adminDashboardTodayReducer'),
    );

    useEffect(() => {
        if (!adminDashboardConfigError && !adminDashboardConfigSuccess && !adminDashboardConfigLoading) {
            dispatch(actions.loadAdminDashboardConfig())
                .then(() => {
                    dispatch(actions.loadAdminDashboardToday());
                })
                .catch(error => {
                    console.error(error);
                    // openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.addFail), 'error');
                })
                .finally(() => {
                    // setDialogueBusy(false);
                });
        }
    }, [adminDashboardConfigError, adminDashboardConfigLoading, adminDashboardConfigSuccess, dispatch]);

    if (!!adminDashboardConfigError) {
        return (
            <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                {txt.loading.noconfig}
            </Typography>
        );
    }

    return (
        <Grid container spacing={2} minHeight={300}>
            <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} marginBlockEnd={4}>
                        {((!!adminDashboardTodayLoading && (adminDashboardTodayData?.length ?? 0) === 0) ||
                            !!adminDashboardConfigLoading) && (
                            <Skeleton
                                animation="wave"
                                height={95}
                                width={'100%'}
                                id={'admin-dashboard-systemalerts-skeleton'}
                                data-testid={'admin-dashboard-systemalerts-skeleton'}
                            />
                        )}
                        {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                            <RibbonChartContainer
                                data={adminDashboardTodayData?.systemalerts}
                                locale={txt.systemalerts}
                                colours={COLOURS}
                                label={txt.systemalerts.title}
                            >
                                <VisualisationSystemAlerts
                                    today={adminDashboardTodayData.systemalerts.today}
                                    assigned={adminDashboardTodayData.systemalerts.assigned}
                                    remaining={adminDashboardTodayData.systemalerts.unassigned}
                                />
                            </RibbonChartContainer>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {!!adminDashboardTodayLoading && (
                            <Skeleton
                                animation="wave"
                                height={225}
                                width={'100%'}
                                id={'admin-dashboard-systemalerts-skeleton'}
                                data-testid={'admin-dashboard-systemalerts-skeleton'}
                            />
                        )}
                        {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                            <PieChartContainer
                                label={txt.works.unprocessed}
                                subtext={
                                    <ExternalLink
                                        id={'unprocessed-link'}
                                        data-testid={'unprocessed-link'}
                                        href={LINK_UNPROCESSED_WORKS}
                                    >
                                        <Typography
                                            fontSize={'0.875rem'}
                                            variant="span"
                                            fontWeight={200}
                                            display={'inline-block'}
                                        >
                                            {txt.works.unprocessedSubText}
                                        </Typography>
                                    </ExternalLink>
                                }
                            >
                                <VisualisationWorks
                                    text={`${adminDashboardTodayData.works.unprocessed}`}
                                    amount={adminDashboardTodayData.works.unprocessed}
                                />
                            </PieChartContainer>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {!!adminDashboardTodayLoading && (
                            <Skeleton
                                animation="wave"
                                height={225}
                                width={'100%'}
                                id={'admin-dashboard-systemalerts-skeleton'}
                                data-testid={'admin-dashboard-systemalerts-skeleton'}
                            />
                        )}
                        {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                            <PieChartContainer
                                label={txt.works.processed}
                                subtext={
                                    <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                        {txt.works.processedSubText}
                                    </Typography>
                                }
                            >
                                <VisualisationWorks
                                    text={`${adminDashboardTodayData.works.processed}`}
                                    amount={adminDashboardTodayData.works.processed}
                                    colour="#35A9A5"
                                />
                            </PieChartContainer>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {!!adminDashboardTodayLoading && (
                            <Skeleton
                                animation="wave"
                                height={225}
                                width={'100%'}
                                id={'admin-dashboard-systemalerts-skeleton'}
                                data-testid={'admin-dashboard-systemalerts-skeleton'}
                            />
                        )}
                        {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                            <GaugeChartContainer
                                label={txt.openaccess.researchOutput.title}
                                subtext={
                                    <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                        {txt.openaccess.researchOutput.subText}
                                    </Typography>
                                }
                            >
                                <VisualisationOpenAccess
                                    text={txt.openaccess.researchOutput.chart.text(
                                        adminDashboardTodayData.oa.current,
                                        adminDashboardTodayData.oa.total,
                                    )}
                                    subText={txt.openaccess.researchOutput.chart.subtext(
                                        adminDashboardTodayData.oa.total,
                                    )}
                                    amount={adminDashboardTodayData.oa.current}
                                    maxAmount={adminDashboardTodayData.oa.total}
                                />
                            </GaugeChartContainer>
                        )}
                    </Grid>
                </Grid>

                {!!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                    <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                        {txt.loading.nodata}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={5}>
                <QuickLinkContainer locale={txt.quicklinks} />
            </Grid>
        </Grid>
    );
};

export default React.memo(Today);
