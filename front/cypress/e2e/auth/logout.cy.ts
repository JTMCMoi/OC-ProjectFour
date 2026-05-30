import { mockSession } from "cypress/support/mocks/session"

describe('Logout', () => {

    beforeEach( () => {
  
        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.login(false)
        cy.wait('@sessionsRequest')
  
    } )

    it('Test de déconnexion', () => {

        cy.contains('span.link', "Logout").click()
        cy.url().should('match', /\/login$/)

    })

});