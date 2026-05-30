import { mockSession } from "cypress/support/mocks/session"

describe('Liste des sessions', () => {

    it("Aucune carte de session ne doit être affichée si aucune session existe", () => {

        cy.intercept('GET','/api/session', {
            statusCode: 200,
            body: []
        }).as('sessionsRequest')

        cy.login(false)

        cy.wait('@sessionsRequest')
        cy.get('.item').should('not.exist')

    })

    it("Au moins une carte de session doit être affichée si des sessions existent", () => {

        cy.intercept('GET','/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.login(false)

        cy.wait('@sessionsRequest')
        cy.get('.item').should('exist')

    })

    it("Les boutons Create et Edit doivent être présents si l'utilisateur est admin", () => {

        cy.intercept('GET','/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.login(true)

        cy.wait('@sessionsRequest')
        cy.contains('span.ml1', 'Create').should('exist')
        cy.contains('span.ml1', 'Edit').should('exist')

    })

    it("Les boutons Create et Edit doivent être absent si l'utilisateur n'est pas admin", () => {

        cy.intercept('GET','/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.login(false)

        cy.wait('@sessionsRequest')
        cy.contains('span.ml1', 'Create').should('not.exist')
        cy.contains('span.ml1', 'Edit').should('not.exist')

    })

});