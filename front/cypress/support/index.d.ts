declare namespace Cypress {
  interface Chainable {
    login(isAdmin: boolean): Chainable<void>
  }
}