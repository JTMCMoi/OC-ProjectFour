import { mockSession } from "cypress/support/mocks/session"
import { mockTeacher } from "cypress/support/mocks/teacher"

describe("Formulaire de session", () => {

    beforeEach( () => {

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [mockSession]
        }).as('sessionsRequest')

        cy.intercept('GET', '/api/teacher', {
            statusCode: 200,
            body: [mockTeacher]
        }).as('teacherRequest')

    } )

    describe("Creation d'une session", () => {

        beforeEach( () => {
            cy.login(true)
            cy.contains('span.ml1', 'Create').click()
        })

        it('Le bouton Submit est désactivé si le formulaire est vide', () => {
            cy.get('button[type="submit"]').should('be.disabled')
        })

        it("Soumission de la création d'une session", () => {

            cy.get('[formControlName="name"]').type('Test 2')
            cy.get('[formControlName="date"]').type('2023-12-31')
            cy.get('mat-select[formControlName="teacher_id"]').click()
            cy.get('mat-option').contains(`${mockTeacher.firstName} ${mockTeacher.lastName}`).click()
            cy.get('[formControlName="description"]').type('Lorem ipsum')

            cy.intercept('POST', '/api/session', {
                statusCode: 200,
                body: { ...mockSession, createdAt: null, updatedAt: null }
            }).as('sessionCreateRequest')

            cy.get('button[type="submit"]').click()
            cy.wait('@sessionCreateRequest')
            cy.url().should('match', /\/sessions$/)
            cy.contains('Session created !').should('be.visible')

        })
    })

    describe("Édition d'une session", () => {

        beforeEach( () => {

            cy.login(true)

            cy.intercept('GET', '/api/session/1', {
                statusCode: 200,
                body: mockSession
            }).as('sessionRequest')

            cy.contains('span.ml1', 'Edit').click()

        })

        it("La session est correctement chargée dans le formulaire", () => {

            cy.get('[formControlName="name"]').should('have.value', mockSession.name)
            cy.get('[formControlName="date"]').should('have.value', '2030-12-31')
            cy.get('mat-select[formControlName="teacher_id"]').should('contain.text', `${mockTeacher.firstName} ${mockTeacher.lastName}`)
            cy.get('[formControlName="description"]').should('have.value', mockSession.description)

        })

        it("Soumission de la mise à jour de la session", () => {

            cy.intercept('PUT', '/api/session/1', {
                statusCode: 200,
                body: mockSession
            }).as('updateSessionRequest')

            cy.intercept('GET', '/api/session/1', {
                statusCode: 200,
                body: mockSession
            }).as('sessionRequest')

            cy.get('button[type="submit"]').click()

            cy.wait('@updateSessionRequest')
            cy.url().should('match', /\/sessions$/)
            cy.contains('Session updated !').should('be.visible')

        })

    })

})