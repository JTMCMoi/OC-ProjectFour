describe('Login', () => {

  beforeEach( () => {
      cy.visit('/login')
  })

  it('Le bouton Submit est désactivé si le formulaire est vide', () => {
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('Affiche une erreur en cas de mauvais identifiants', () => {

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401
    }).as('loginRequest')

    cy.get('[formControlName="email"]').type('wrong@email.com')
    cy.get('[formControlName="password"]').type('badpass')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')

    cy.get('.error').should('be.visible')

  })

  it('Redirection vers /sessions en cas de login réussi', () => {

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
      }
    }).as('loginRequest')

    cy.get('[formControlName="email"]').type('john@doe.com')
    cy.get('[formControlName="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')

    cy.url().should('include', '/sessions')

  })

});