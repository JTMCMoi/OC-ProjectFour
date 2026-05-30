import { mockSession } from "cypress/support/mocks/session"
import { mockTeacher } from "cypress/support/mocks/teacher"

describe("Details d'une session", () => {

    beforeEach( () => {

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSession
        }).as('sessionRequest')

        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: mockTeacher
        }).as('teacherRequest')

    })

    it('Affiche correctement les informations de la session', () => {

        cy.login(false)
        cy.wait('@sessionsRequest')

        cy.contains('span.ml1', "Detail").first().click()

        cy.wait('@sessionRequest')
        cy.wait('@teacherRequest')

        cy.contains('h1', mockSession.name).should('exist')
        cy.contains('span.ml1', `${mockTeacher.firstName} ${mockTeacher.lastName.toUpperCase()}`).should('exist')

    })

    it("Affiche le bouton Delete si l'utilisateur est admin", () => {

        cy.login(true)
        cy.wait('@sessionsRequest')

        cy.contains('span.ml1', "Detail").first().click()

        cy.wait('@sessionRequest')
        cy.wait('@teacherRequest')

        cy.contains('span.ml1', 'Delete').should('exist')

    })

    it("Affiche le bouton Participate si l'utilisateur n'est pas admin et ne participe pas", () => {

        cy.login(false)
        cy.wait('@sessionsRequest')

        cy.contains('span.ml1', "Detail").first().click()

        cy.wait('@sessionRequest')
        cy.wait('@teacherRequest')

        cy.contains('span.ml1', 'Participate').should('exist')

    })

    it("Affiche le bouton Do not participate si l'utilisateur n'est pas admin et ne participe pas", () => {

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: { ...mockSession, users: [1] }
        }).as('sessionRequest')

        cy.login(false)
        cy.wait('@sessionsRequest')

        cy.contains('span.ml1', "Detail").first().click()

        cy.wait('@sessionRequest')
        cy.wait('@teacherRequest')

        cy.contains('span.ml1', 'Do not participate').should('exist')

    })

    it("Test la suppression de la session si l'utilisateur est admin", () => {

        cy.login(true)
        cy.wait('@sessionsRequest')

        cy.contains('span.ml1', "Detail").first().click()

        cy.wait('@sessionRequest')
        cy.wait('@teacherRequest')

        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200,
        }).as('sessionDeleteRequest')

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.contains('span.ml1', 'Delete').first().click()

        cy.url().should('match', /\/sessions$/)
        cy.contains('Session deleted !').should('be.visible')

    })

})