context('Thesis', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        cy.wait(2000);
    });

    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('Submitting a thesis successfully', () => {
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 8);

        // Title
        cy.typeCKEditor('rek-title', '<p>This is a thesis title</p>');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 7);
        // Abstract
        cy.typeCKEditor('rek-description', '<p>This is the thesis abstract</p>');
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 6);

        // Thesis subtype
        cy.get('[data-testid=rek-genre-type-select]').click();
        cy.get('li[data-value="MPhil Thesis"]').click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 5);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Enrolling unit
        cy.get('[data-testid=rek-org-unit-name-input]').type('a');
        cy.clickAutoSuggestion('rek-org-unit-name', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Supervisors
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('button[aria-label="Remove this item"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('Vishal Asai{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
        cy.get('ul.ContributorList')
            .children()
            .should('have.length', 2);
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Move item up the order"]').click();
        cy.get('ul.ContributorList')
            .children()
            .last()
            .should('contain', 'Vishal Asai');
        cy.get('ul.ContributorList')
            .children()
            .first()
            .should('contain', 'Ky Lane');
        cy.get('button[aria-label="Remove all items').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 4);
        cy.get('[data-testid=rek-supervisor-input]').type('Ky Lane{enter}', { delay: 30 });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);

        // Field of Research
        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.clickAutoSuggestion('rek-subject', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('#rek-subject-list-row-0')
            .should('contain.text', '0101 Pure Mathematics')
            .get('#rek-subject-list-row-0-delete')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('[data-testid=rek-subject-input]').type('b');
        cy.clickAutoSuggestion('rek-subject', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('#delete-all-rek-subject').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 3);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('[data-testid=rek-subject-input]').type('a');
        cy.clickAutoSuggestion('rek-subject', 0);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');

        // Keywords
        cy.get('[data-testid=rek-keywords-input]').type('First Keyword{enter}', {
            delay: 30,
        });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.get('#rek-keywords-list-row-0-delete').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('[data-testid=rek-keywords-input]').type('Second Keyword{enter}', {
            delay: 30,
        });
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('#delete-all-rek-keywords').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 2);
        cy.get('[data-testid=rek-keywords-input]').type('Third Keyword{enter}', {
            delay: 30,
        });
        cy.get('#rek-keywords-list').should('have.length', 1);
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);
        cy.get('[data-testid=rek-keywords-input]').type('Fourth Keyword|Fifth Keyword|Sixth Keyword{enter}', {
            delay: 30,
        });
        cy.get('#rek-keywords-list')
            .children()
            .should('have.length', 4);

        // Files?
        const uploadFile = fileName => {
            cy.get('[data-testid="fez-datastream-info-input"]').attachFile(fileName, { subjectType: 'drag-n-drop' });
        };

        uploadFile('test.jpg');

        cy.get('[data-testid="dsi-dsid-0-delete"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);

        uploadFile('test_two.jpg');
        cy.get('[id="delete-all-files"]').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('.Alert')
            .find('ul')
            .children()
            .should('have.length', 1);

        uploadFile('test three.jpg');

        cy.get('div.Alert').should('have.length', 2);

        uploadFile('test.jpg');
        uploadFile('test_two.jpg');

        // Ready to submit
        cy.get('button#submit-thesis').should('not.have.attr', 'disabled');
    });
});
