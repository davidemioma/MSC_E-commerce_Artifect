/// <reference types="cypress" />

import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in to the application.
       * @example
       *    cy.login('myusername', 'mypassword')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit(`${Cypress.env("public_url")}/auth/sign-in`);

  cy.get('input[placeholder="email@example.com"]').type(email);

  cy.get('input[placeholder="******"]').type(password, { log: false });

  cy.get('[data-cy="sign-in-btn"]').click();
});
