describe("Manage a store", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 10000 }).should("be.visible");

    //Store Page
    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId_manage"
      )}/settings`,
      { failOnStatusCode: false }
    );
  });

  it("Close alert store modal", () => {
    cy.get('[data-cy="open-store-btn"]').should("not.exist");

    cy.get('[data-cy="close-store-btn"]').should("exist").click();

    cy.get('[data-cy="store-close-modal-continue"]').should("exist");

    cy.get('[data-cy="store-close-modal-cancel"]').should("exist").click();

    cy.get('[data-cy="store-close-modal-continue"]').should("not.exist");
  });

  it("Close a store", () => {
    cy.get('[data-cy="open-store-btn"]').should("not.exist");

    cy.get('[data-cy="close-store-btn"]').should("exist").click();

    cy.get('[data-cy="store-close-modal-continue"]').should("exist").click();

    //Wait for API
    cy.wait(8000);

    cy.get('[data-cy="open-store-btn"]').should("exist");
  });

  it("Open a store", () => {
    cy.get('[data-cy="close-store-btn"]').should("not.exist");

    cy.get('[data-cy="open-store-btn"]').should("exist").click();

    //Wait for API
    cy.wait(8000);

    cy.get('[data-cy="close-store-btn"]').should("exist");
  });
});
