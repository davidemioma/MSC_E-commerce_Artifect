import "cypress-file-upload";

describe("Store Form", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 10000 }).should("be.visible");

    //Store Page
    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env("auth_storeId")}`
    );

    //Check if store switcher button exists and click it.
    cy.get('[data-cy="store-popover-btn"]').should("be.visible").click();

    Cypress.on("uncaught:exception", (err, runnable) => {
      if (
        err.message.includes(
          "ResizeObserver loop completed with undelivered notifications"
        )
      ) {
        return false;
      }
    });
  });

  it("Open create store modal", () => {
    //Click create store button
    cy.get('[data-cy="create-store-btn"]').should("be.visible").click();

    //Store modal should be visible
    cy.get('input[placeholder="Store Name"]').should("be.visible");
  });

  it("Close create store modal", () => {
    //Click create store button
    cy.get('[data-cy="create-store-btn"]').should("be.visible").click();

    cy.get('[data-cy="store-close-btn"]').should("be.visible").click();

    cy.get('[data-cy="store-popover-btn"]').should("be.visible");
  });

  it("Should show error message when submitting invalid form", () => {
    //Click create store button
    cy.get('[data-cy="create-store-btn"]').should("be.visible").click();

    //Show create button
    cy.get('[data-cy="store-submit-btn"]').should("contain", "Create").click();

    cy.get('[data-cy="store-name-err"]').should("be.visible");

    cy.get('[data-cy="store-email-err"]').should("be.visible");

    cy.get('[data-cy="store-country-err"]').should("be.visible");

    cy.get('[data-cy="store-postcode-err"]').should("be.visible");
  });

  it("Invalid Postcode", () => {
    //Click create store button
    cy.get('[data-cy="create-store-btn"]').should("be.visible").click();

    cy.get('input[placeholder="Store Name"]')
      .should("be.visible")
      .type("Test Store");

    cy.get('input[placeholder="user@mail.com"]')
      .should("be.visible")
      .type(`${Cypress.env("auth_email")}`);

    cy.get('[data-cy="country-select"]').should("be.visible").click();

    cy.get('[data-cy^="country-select-GB"]').click();

    cy.get('input[placeholder="123456"]').should("be.visible").type("123");

    //Show create button
    cy.get('[data-cy="store-submit-btn"]').should("contain", "Create").click();

    //wait for API
    cy.wait(8000);

    cy.get('[data-cy="create-store-err"]').should("exist");
  });

  it("Store already exists", () => {
    //Click create store button
    cy.get('[data-cy="create-store-btn"]').should("be.visible").click();

    cy.get('input[placeholder="Store Name"]')
      .should("be.visible")
      .type("David's Sneaker Store");

    cy.get('input[placeholder="user@mail.com"]')
      .should("be.visible")
      .type(`${Cypress.env("auth_email")}`);

    cy.get('[data-cy="country-select"]').should("be.visible").click();

    cy.get('[data-cy^="country-select-GB"]').click();

    cy.get('input[placeholder="123456"]').should("be.visible").type("AL109WX");

    cy.get('[data-cy="store-submit-btn"]').should("contain", "Create").click();

    //wait for API
    cy.wait(8000);

    cy.get('[data-cy="create-store-err"]').should("exist");
  });
});
