context('Incomplete record form', () => {
    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    const checkSignificance = significance => {
        cy.get('[data-testid=rek-significance-select]')
            .click();
        cy.get('[data-testid=rek-significance-options]')
            .contains(significance)
            .click();
        cy.get('[data-testid=rek-significance-select]')
            .should('contain', significance);
    };

    const checkResearchStatement = statement => {
        cy.typeCKEditor('editor1', statement);
        cy.readCKEditor('editor1')
            .then(text => {
                cy.wrap(text)
                    .should('eq', statement);
            });
    };

    const checkAudienceSize = sizeText => {
        cy.get('[data-testid=rek-audience-size-select]')
            .click();
        cy.get('[data-testid=rek-audience-size-options]')
            .contains(sizeText)
            .click();
        cy.get('[data-testid=rek-audience-size-select]')
            .should('contain', sizeText);
    };

    const checkQualityIndicators = indicator => {
        cy.get('#quality-indicators')
            .click();
        cy.get('#menu-')
            .find('li')
            .contains(indicator)
            .click();
        cy.get('#menu-')
            .click(10, 10);
        cy.get('#quality-indicators')
            .should('contain', indicator);
    };

    const checkNonDeletableAuthors = authorCount => {
        Array.from({ length: authorCount }, (x, i) => {
            cy.get(`#authors-list-row-delete-${i}`)
                .should('be.disabled');
        });
    };

    const authorEditInstruction = 'Step 2 of 2 - Update the affiliation information.';
    const grantMessage = 'You must click ADD GRANT to enter the value to the grants list';
    const validationErrorsSelector = 'form > div > div:last-of-type .Alert ul li';

    const editNonUQAuthor = (authorNumber, orgName, orgType) => {
        cy.get(`#authors-list-row-edit-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('#submit-author')
            .should('have.attr', 'disabled');
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');
        cy.get('#org-affiliation-name')
            .type(orgName);

        // Select affiliation type
        cy.get('#org-affiliation-type')
            .click();
        cy.get('#menu-org-affiliation-type')
            .find('li')
            .contains(orgType)
            .click();

        // Apply changes
        cy.get('#submit-author')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('#submit-author') // Re-select to get updated element
            .click();
        cy.get(`#authors-list-row-${authorNumber}`)
            .should('contain', orgName)
            .should('contain', `Organisation type: ${orgType}`);
        cy.get(`#authors-list-row-edit-${authorNumber}`)
            .parents('.StandardCard')
            .eq(0)
            .should('not.contain', authorEditInstruction);
    };

    const editUQAuthor = authorNumber => {
        cy.get(`#authors-list-row-edit-${authorNumber}`)
            .click()
            .parents('ul')
            .first()
            .siblings('div')
            .contains(authorEditInstruction);
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');

        // Mark as UQ author
        cy.get('#org-affiliation-selector')
            .click();
        cy.get('#menu-org-affiliation-selector')
            .find('li')
            .eq(1)
            .should('not.contain', 'Not')
            .click();
        cy.get('#authors-name-as-published-field')
            .should('have.attr', 'disabled');

        // Apply changes
        cy.get('#submit-author')
            .should('have.attr', 'tabindex', '0')
            .should('not.have.attr', 'disabled');
        cy.get('#submit-author') // Re-select to get updated element
            .click();
        cy.get(`#authors-list-row-${authorNumber}`)
            .should('contain', 'The University of Queensland')
            .should('contain', 'Organisation type: University');
        cy.get(`#authors-list-row-edit-${authorNumber}`)
            .parents('.StandardCard')
            .eq(0)
            .should('not.contain', authorEditInstruction);
    };

    it('should allow completion of creative work', () => {
        const pid = 'UQ:352045';
        const authorUsername = 'uqrdav10';
        cy.visit(`/records/${pid}/incomplete?user=${authorUsername}`);
        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');

        checkSignificance('Major');
        checkResearchStatement('Creator research statement');
        checkAudienceSize('Less than 100');
        checkQualityIndicators('Commissioned by external body');
        checkNonDeletableAuthors(4);
        editNonUQAuthor(0, 'Test org type', 'Government');
        editUQAuthor(1);
        editUQAuthor(3);
    });

    it('should allow completion of work with total pages field, a disabled author', () => {
        const pid = 'UQ:716942';
        const authorUsername = 'uqagrinb';
        cy.visit(`/records/${pid}/incomplete?user=${authorUsername}`);
        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');

        checkSignificance('Major');
        checkResearchStatement('Creator research statement');

        cy.get('#rek-total-pages')
            .type('10');

        checkAudienceSize('Less than 100');
        checkQualityIndicators('Commissioned by external body');
        checkNonDeletableAuthors(4);

        cy.get('#authors-list-row-edit-0')
            .should('be.disabled');

        editUQAuthor(1);
        editNonUQAuthor(2, 'Test org type', 'Government');
        editUQAuthor(3);

        cy.get(validationErrorsSelector)
            .should('have.length', 1)
            .should('contain', 'File submission to be completed');

        cy.get('#update-my-work')
            .should('exist')
            .should('be.disabled');
    });

    it('should have working tests for Grants editor', () => {
        cy.get('#grant-agency-name')
            .type('Grant name');
        cy.get('button#add-grant')
            .should('be.disabled');
        cy.get(validationErrorsSelector)
            .as('validationMessage')
            .should('have.length', 2)
            .should('contain', grantMessage);
        cy.get('#grant-id')
            .type('0001');
        cy.get('#grant-type')
            .click();
        cy.get('body > [role=presentation]')
            .find('li')
            .contains('Commercial Gallery')
            .click();
        cy.get('#grant-type')
            .should('contain', 'Commercial Gallery');
        cy.get('button#add-grant')
            .should('be.enabled')
            .click();
        cy.get('@validationMessage')
            .should('have.length', 1)
            .should('not.contain', grantMessage);
    });
});
