import { mockSession } from "cypress/support/mocks/session"
import { mockUser } from "cypress/support/mocks/user"

describe("Page d'information de l'utilisateur", () => {

    beforeEach( () => {

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

    })

    it("Affiche correctement les informations de l'utilisateur", () => {

        cy.intercept('GET', '/api/user/1', {
            statusCode: 200,
            body: mockUser
        }).as('userRequest')

        cy.login(false)
        cy.wait('@sessionsRequest')
        cy.contains('span.link', "Account").click()
        cy.wait('@userRequest')
        cy.contains('p', `Email: ${mockUser.email}`).should('exist')

    })

    describe("Si l'utilisateur n'est pas admin", () => {

        it("Affiche le bouton de suppression de compte", () => {

            cy.intercept('GET', '/api/user/1', {
                statusCode: 200,
                body: mockUser
            }).as('userRequest')

            cy.login(false)
            cy.wait('@sessionsRequest')
            cy.contains('span.link', "Account").click()
            cy.wait('@userRequest')
            cy.contains('span.ml1', 'Detail').should('exist')

        })

        it("Suppression du compte si l'utilisateur", () => {

            cy.intercept('GET', '/api/user/1', {
                statusCode: 200,
                body: mockUser
            }).as('userRequest')

            cy.intercept('DELETE', '/api/user/1', {
                statusCode: 200,
                body: ''
            }).as('userDeleteRequest')

            cy.login(false)
            cy.wait('@sessionsRequest')
            cy.contains('span.link', "Account").click()
            cy.wait('@userRequest')
            cy.contains('span.ml1', 'Detail').click()
            cy.wait('@userDeleteRequest')
            cy.url().should('match', /\/login$/)
            cy.contains('Your account has been deleted !').should('be.visible')

        })

    })

    describe("Si l'utilisateur est admin", () => {

        it("Affiche que l'utilisateur est admin", () => {

            cy.intercept('GET', '/api/user/1', {
                statusCode: 200,
                body: { ...mockUser, admin: true }
            }).as('userRequest')

            cy.login(false)
            cy.wait('@sessionsRequest')
            cy.contains('span.link', "Account").click()
            cy.wait('@userRequest')
            cy.contains('p.my2', 'You are admin').should('exist')

        })

    })

})