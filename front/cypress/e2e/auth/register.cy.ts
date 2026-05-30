describe('Register', () => {

    beforeEach( () => {
        cy.visit('/register')
    })

    it('Le bouton Submit est désactivé si le formulaire est vide', () => {
        cy.get('button[type="submit"]').should('be.disabled')
    })

    it('Affiche une erreur en cas de login déjà pris', () => {

        cy.intercept('POST', '/api/auth/register', {
            statusCode: 400
        }).as('registerRequest')

        cy.get('[formControlName="firstName"]').type('John')
        cy.get('[formControlName="lastName"]').type('Doe')
        cy.get('[formControlName="email"]').type('already@used.mail')
        cy.get('[formControlName="password"]').type('anypass')
        cy.get('button[type="submit"]').click()

        cy.wait('@registerRequest')

        cy.get('.error').should('be.visible')

    })

    it('Redirection vers /login en cas de création de compte réussie', () => {

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
    }).as('registerRequest')

    cy.get('[formControlName="firstName"]').type('John')
    cy.get('[formControlName="lastName"]').type('Doe')
    cy.get('[formControlName="email"]').type('john@doe.com')
    cy.get('[formControlName="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@registerRequest')

    cy.url().should('include', '/login')

  })

});