/* eslint-disable no-unused-vars */
import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitFor, waitForElementToBeRemoved } from 'test-utils';

import * as DashboardActions from 'actions/adminDashboard';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

import AdminDashboard, { CustomTabPanel } from './AdminDashboard';

const setup = (props = {}, state = {}, renderer = render) => {
    return renderer(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <AdminDashboard {...props} />
        </WithReduxStore>,
    );
};

describe('AdminDashboard', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl)
            .reply(200, { data: { ...mockData.adminDashboardConfig } });
        mockApi
            .onGet(repositories.routes.ADMIN_DASHBOARD_TODAY_API().apiUrl)
            .reply(200, { data: { ...mockData.adminDashboardToday } });
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render no config error (empty config array)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, []);
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });
    it('should render no config error (null return)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(200, null);
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });
    it('should render no config error (loading error message)', async () => {
        mockApi.onGet(repositories.routes.ADMIN_DASHBOARD_CONFIG_API().apiUrl).reply(422, { message: 'test' });
        const loadAdminDashboardConfigFn = jest.spyOn(DashboardActions, 'loadAdminDashboardConfig');
        const { getByTestId, getByText } = setup();
        expect(loadAdminDashboardConfigFn).toHaveBeenCalled();
        expect(getByTestId('page-title')).toHaveTextContent('Admin dashboard');
        await waitForElementToBeRemoved(getByText('Loading config data...'));
        expect(getByText('No config available')).toBeInTheDocument();
    });

    it('should render page tabbed component and loaders', async () => {
        const loadAdminDashboardTodayFn = jest.spyOn(DashboardActions, 'loadAdminDashboardToday');

        const { getByTestId, getAllByTestId, getByText, getAllByRole } = setup();
        await waitFor(() => expect(loadAdminDashboardTodayFn).toHaveBeenCalled());

        expect(getAllByRole('tab').length).toBe(3);
        expect(getAllByRole('tab')[0]).toHaveTextContent('TODAY');
        expect(getAllByRole('tab')[1]).toHaveTextContent('SYSTEM ALERTS');
        expect(getAllByRole('tab')[2]).toHaveTextContent('REPORTS');
        expect(getAllByTestId('admin-dashboard-systemalerts-skeleton').length).toBe(3);
        expect(getAllByTestId('admin-dashboard-quicklinks-skeleton').length).toBe(8);
        expect(getByText('Quick Links')).toBeInTheDocument();
        expect(getByTestId('quick-link-progressor')).toBeInTheDocument();
    });

    // Note: at the time of writing (May 2024), mui-x/chart components do not work with Jest tests.
    // Coverage for the when charts are shown etc. is covered in Cypress instead.

    describe('CustomTabPanel', () => {
        it('should render child', () => {
            const { getByTestId, getByText, getByRole } = render(
                <CustomTabPanel value={1} index={1} className="testClass">
                    <div>Test child</div>
                </CustomTabPanel>,
            );
            expect(getByTestId('admin-dashboard-tabs-1')).toBeInTheDocument();
            expect(getByTestId('admin-dashboard-tabs-1')).toHaveClass('testClass');
            expect(getByText('Test child')).toBeInTheDocument();
        });
        it('should not render child', () => {
            const { getByTestId, queryByText } = render(
                <CustomTabPanel value={1} index={2} role="test">
                    <div>Test child</div>
                </CustomTabPanel>,
            );
            expect(getByTestId('admin-dashboard-tabs-2')).toBeInTheDocument();
            expect(queryByText('Test child')).not.toBeInTheDocument();
        });
    });
});
