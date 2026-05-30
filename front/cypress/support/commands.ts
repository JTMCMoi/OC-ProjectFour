Cypress.Commands.add('login', (isAdmin: boolean) => {

  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: isAdmin,
    }
  }).as('loginRequest')

  cy.visit('/login')
  cy.get('[formControlName="email"]').type('john@doe.com')
  cy.get('[formControlName="password"]').type('password123')
  cy.get('button[type="submit"]').click()
  cy.wait('@loginRequest')

})