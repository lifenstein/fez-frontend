import * as routes from './routes';
import { accounts } from 'mock/data/account';
import { locale } from 'locale';

describe('Routes method', () => {
    it('should return a list of menus for anon user', () => {
        const testRoutes = routes.getMenuConfig(null);
        expect(testRoutes.length).toEqual(4);
    });

    it('should return a list of menus for researcher', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher);
        expect(testRoutes.length).toEqual(12);
    });

    it('should return a list of menus including incomplete menu item for researcher', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher, false, true);
        expect(testRoutes.length).toEqual(13);
    });

    it('should return a list of menus for a user with dashboard enabled only (eg HDR student without ORCID)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher, true);
        expect(testRoutes.length).toEqual(6);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff);
        expect(testRoutes.length).toEqual(19);
    });

    it('should return a list of menus including incomplete menu item for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, false, true);
        expect(testRoutes.length).toEqual(20);
    });

    it('should return a list of routes for anon user', () => {
        const testRoutes = routes.getRoutesConfig({ components: {}, account: null });
        expect(testRoutes.length).toEqual(7);
    });

    it('should return a list of routes for researcher', () => {
        const testRoutes = routes.getRoutesConfig({ components: {}, account: accounts.uqresearcher });
        expect(testRoutes.length).toEqual(23);
    });

    it('should return a list of routes for user who can masquerade', () => {
        const testRoutes = routes.getRoutesConfig({ components: {}, account: accounts.uqstaff });
        expect(testRoutes.length).toEqual(32);
    });

    it('should return a list of routes for hdr student without ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.s2222222,
            forceOrcidRegistration: true,
            isHdrStudent: true,
        });
        expect(testRoutes.length).toEqual(8);
    });

    it('should return a list of routes for hdr student with ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.s2222222,
            forceOrcidRegistration: false,
            isHdrStudent: true,
        });
        expect(testRoutes.length).toEqual(23);
    });

    it('should render auth required page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({ components: { StandardPage: testComponent }, account: null });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.contact,
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.authenticationRequired);
    });

    it('should render permissions denied page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            account: accounts.uqresearcher,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.admin.masquerade,
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.permissionDenied);
    });

    it('should render permissions denied or not found page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            account: accounts.uqresearcher,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: '/view/UQ:1/test.pdf',
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.permissionDenied);
    });

    it('should render not found page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({ components: { StandardPage: testComponent } });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: '/abc/abac/aba',
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.notFound);
    });

    it('should not return Switch to old interface menu item for public view page', () => {
        const testMenuItems = routes.getMenuConfig(null, false, true);
        expect(testMenuItems.length).toEqual(4);

        const contactMenuItem = testMenuItems.pop();
        expect(contactMenuItem.primaryText).toEqual('Contact');
    });

    it('should return Switch to old interface menu item for logged in user on view page', () => {
        const testMenuItems = routes.getMenuConfig(accounts.uqresearcher, false, true);
        expect(testMenuItems.length).toEqual(13);
    });

    it('file.url should without checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const url = routes.pathConfig.file.url(pid, filename);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}`);
    });

    it('file.url should with checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const checksum = 'a5a5d5qwe5dq5f5qefqe';
        const versionHash = routes.getDatastreamVersionQueryString(filename, checksum);
        const url = routes.pathConfig.file.url(pid, filename, checksum);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}?dsi_version=${versionHash}`);
    });
});
