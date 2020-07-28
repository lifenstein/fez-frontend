import formsLocale from '../../src/locale/forms';
import fileUploaderLocale from '../../src/modules/SharedComponents/Toolbox/FileUploader/locale';

context('Claim possible work', () => {
    const baseUrl = Cypress.config('baseUrl');
    const claimFormLocale = formsLocale.forms.claimPublicationForm;

    const navToFirstClaim = () => {
        cy.visit('/records/possible').then(() => {
            cy.get('[data-testid*="publication-action-"]').should('have.length', 16);
            cy.get('[data-testid=publication-action-UQ641272-primary]').click();
            cy.url().should('equal', `${baseUrl}/records/claim`);
        });
    };

    afterEach(() => {
        cy.navToHomeFromMenu(claimFormLocale.cancelWorkflowConfirmation);
    });

    it('renders a list of possible works with filters', () => {
        cy.visit('/records/possible').then(() => {
            cy.get('h2')
                .should('have.length', 1)
                .should('contain', 'Claim possible works');

            cy.get('.StandardCard h6[class*="PublicationCitation-citationTitle"] > a').should('have.length', 8);
            cy.get('[class*="MuiGrid-grid-sm-3"] h6')
                .should('have.length', 1)
                .should('contain', 'Refine results');
            cy.get('[class*="MuiGrid-grid-sm-3"] .facetsFilter [class*="MuiListItem-root-"]').should('have.length', 6);
        });
    });

    it('can navigate to a claim page with specific elements', () => {
        navToFirstClaim();
        cy.get('h2')
            .should('have.length', 1)
            .should('contain', claimFormLocale.title);
        cy.get('.StandardCard h3')
            .should('contain', claimFormLocale.claimingInformation.title)
            .should('contain', claimFormLocale.authorLinking.title)
            .should('contain', claimFormLocale.contributorLinking.title)
            .should('contain', claimFormLocale.contentIndicators.title)
            .should('contain', claimFormLocale.comments.title)
            .should('contain', claimFormLocale.fileUpload.title);
        cy.get('.Alert b')
            .scrollIntoView()
            .should('contain', claimFormLocale.validationAlert.title);
        cy.contains('button', claimFormLocale.cancel).should('not.be.disabled');
        cy.contains('button', claimFormLocale.submit).should('be.disabled');
    });

    it('can cancel a claim after filling the form', () => {
        navToFirstClaim();
        cy.contains('.StandardCard', claimFormLocale.comments.title)
            .find('textarea')
            .type('Test comment');
        cy.contains('button', claimFormLocale.cancel).click();
        cy.contains('[role="dialog"]', claimFormLocale.cancelWorkflowConfirmation.confirmationTitle)
            .contains(claimFormLocale.cancelWorkflowConfirmation.confirmButtonLabel)
            .click();
        cy.url().should('contain', `${baseUrl}/records/possible`);
    });

    it('allows selection of unselected content indicators, but does not allow deselection of existing', () => {
        navToFirstClaim();
        cy.contains(claimFormLocale.contentIndicators.title).scrollIntoView();
        cy.get('[data-testid=rek-content-indicator-select]').click();
        // Click new item in multiselect modal
        cy.get('[data-testid=rek-content-indicator-options]')
            .contains('Protocol')
            .click();
        // Click outside the multiselect
        cy.get('[data-testid=rek-content-indicator-options]').click(10, 10);
        cy.get('[data-testid=rek-content-indicator-select]')
            .contains('Scholarship of Teaching and Learning, Protocol')
            .click();
        // Preselected item in multiselect modal should be unclickable
        cy.get('[data-testid=rek-content-indicator-options]')
            .contains('li', 'Scholarship of Teaching and Learning')
            .should('have.css', 'pointer-events', 'none');
        // Click outside the multiselect
        cy.get('[data-testid=rek-content-indicator-options]').click(10, 10);
        // Selection has not changed
        cy.get('[data-testid=rek-content-indicator-select]').contains('Scholarship of Teaching and Learning, Protocol');
    });

    it('will detect and prevent submission of invalid URLs', () => {
        navToFirstClaim();
        // Make form valid otherwise
        cy.contains('.StandardCard', claimFormLocale.authorLinking.title)
            .find('button')
            .first()
            .click();
        cy.contains('I confirm and understand').click();
        // Confirm form submission is enabled
        cy.contains('button', claimFormLocale.submit).should('not.be.disabled');
        // Enter invalid data triggers validation errors
        cy.contains('.StandardCard', claimFormLocale.comments.title)
            .find('input')
            .type('invalid')
            .closest('.StandardCard')
            .contains('URL is not valid');
        // Confirm form submission is disabled until URL is fixed
        cy.contains('button', claimFormLocale.submit).should('be.disabled');
        cy.contains('.StandardCard', claimFormLocale.comments.title)
            .find('input')
            .type('.com');
        cy.contains('button', claimFormLocale.submit).should('be.disabled');
        cy.contains('.StandardCard', claimFormLocale.comments.title)
            .find('input')
            .type('{home}{del}{del}https://');
        cy.contains('button', claimFormLocale.submit).should('not.be.disabled');
    });

    it('will allow upload of files', () => {
        navToFirstClaim();
        const fileName = 'test.jpg';
        cy.fixture(fileName).then(fileContent => {
            cy.get('div#FileUploadDropZone').upload(
                { fileContent, fileName, mimeType: 'image/jpg' },
                { subjectType: 'drag-n-drop' },
            );
        });
        cy.contains('.StandardCard', claimFormLocale.fileUpload.title)
            .should('contain', fileUploaderLocale.successMessage.replace('[numberOfFiles]', '1'))
            .contains(fileUploaderLocale.fileUploadRow.fileUploadRowAccessSelector.initialValue)
            .click();
        cy.get('[data-testid=dsi-open-access-0-options]')
            .contains('Open Access')
            .click();
        cy.get('[class*="FileUploadTermsAndConditions-root"]').click();
    });

    it('can choose author, then submit the claim.', () => {
        navToFirstClaim();
        cy.contains('.StandardCard', claimFormLocale.authorLinking.title)
            .find('button')
            .first()
            .click();
        cy.contains('I confirm and understand').click();
        cy.contains('button', claimFormLocale.submit)
            .should('not.be.disabled')
            .click();
        // Testing of the alerts are too time sensitive
        // cy.get('[class*="Alert-info"] .alert-text')
        //     .should('contain', claimFormLocale.progressAlert.title)
        //     .should('contain', claimFormLocale.progressAlert.message);
        // cy.get('[class*="Alert-done"] .alert-text')
        //     .should('contain', claimFormLocale.successAlert.title)
        //     .should('contain', claimFormLocale.successAlert.message);
        cy.get('div[role="dialog"]')
            .contains(claimFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.get('div[role="dialog"]')
            .contains('button', claimFormLocale.successWorkflowConfirmation.cancelButtonLabel)
            .click();
        cy.url().should('contain', `${baseUrl}/records/possible`);
    });

    it('can choose editor, then submit the claim.', () => {
        cy.visit('/records/possible').then(() => {
            cy.waitUntil(() => {
                cy.contains('.publicationCitation', 'Book with editors')
                    .find('button.publicationAction')
                    .first()
                    .click();
                return cy.url().should('equal', `${baseUrl}/records/claim`);
            });

            cy.url().should('equal', `${baseUrl}/records/claim`);
            cy.contains('.StandardCard', claimFormLocale.contributorLinking.title)
                .find('button')
                .first()
                .click();
            cy.contains('I confirm and understand').click();
            cy.contains('button', claimFormLocale.submit)
                .should('not.be.disabled')
                .click();
            // Testing of the alerts are too time sensitive
            // cy.get('[class*="Alert-info"] .alert-text')
            //     .should('contain', claimFormLocale.progressAlert.title)
            //     .should('contain', claimFormLocale.progressAlert.message);
            // cy.get('[class*="Alert-done"] .alert-text')
            //     .should('contain', claimFormLocale.successAlert.title)
            //     .should('contain', claimFormLocale.successAlert.message);
            cy.get('div[role="dialog"]')
                .contains(claimFormLocale.successWorkflowConfirmation.confirmationTitle)
                .should('have.length', 1);
            cy.get('div[role="dialog"]')
                .contains('button', claimFormLocale.successWorkflowConfirmation.cancelButtonLabel)
                .click();
            cy.url().should('contain', `${baseUrl}/records/possible`);
        });
    });
});
