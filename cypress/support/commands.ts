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
      addToCart(): Chainable<void>;
      removeFromCart(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit(`${Cypress.env("public_url")}/auth/sign-in`);

  cy.get('input[placeholder="email@example.com"]').type(email);

  cy.get('input[placeholder="******"]').type(password, { log: false });

  cy.get('[data-cy="sign-in-btn"]').click();
});

Cypress.Commands.add("addToCart", () => {
  //Select size
  cy.get(`[data-cy="product-size-${Cypress.env("test_productId")}-0"]`, {
    timeout: 10000,
  })
    .should("be.visible")
    .click();

  //Add to cart btn should not be disabled
  cy.get(
    `[data-cy="product-${Cypress.env("test_productId")}-add-to-cart-btn"]`,
    {
      timeout: 10000,
    }
  )
    .should("not.be.disabled")
    .click();

  cy.get('[data-cy="cart-number"]', {
    timeout: 10000,
  }).should("contain", "1");
});

Cypress.Commands.add("removeFromCart", () => {
  cy.get('[data-cy="cart-trigger"]', {
    timeout: 15000,
  })
    .should("be.visible")
    .click();

  cy.get('[data-cy="cart-content"]', { timeout: 15000 }).should("be.visible");

  cy.get('[data-cy="cart-item-0"]', { timeout: 15000 }).should("be.visible");

  cy.get('[data-cy="cart-item-0-remove"]').should("be.visible").click();

  cy.get('[data-cy="empty-cart"]', { timeout: 15000 }).should("be.visible");
});
