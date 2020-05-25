import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDataCollection';

context('Data Collection admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(7);
        cy.adminEditVerifyAlerts(1, ['Publication date is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(1);

        cy.log('Finished testing tabs'); // This makes the test suite a bit more stable. It's magic :p
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Dataset name');
            });

        // -------------------------------------- ADDITIONAL INFORMATION TAB -----------------------------------------
        cy.log('Additional Information tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(3)
            .as('additionalInformationTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Additional information');
                cy.get('label[id="Licence-label"]')
                    .parent()
                    .find('input[type=hidden]')
                    .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                    .siblings('[role=button]')
                    .invoke('text')
                    .should('match', new RegExp(`^${record.fez_record_search_key_license.rek_license_lookup}`));
                cy.checkPartialDateFromRecordValue('end-date', record.fez_record_search_key_end_date.rek_end_date);
            });
    });
});
