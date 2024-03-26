const SIZE_INDEX = 0;

describe("Size for store", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 15000 }).should("be.visible");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/sizes`
    );
  });

  it("Create fail for invalid form", () => {
    cy.get('[data-cy="new-size-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(3000);

    cy.get('[data-cy="size-form"]').should("exist");

    cy.get('[data-cy="size-create-btn"]').should("be.visible").click();

    cy.get('[data-cy="size-name-input-err"]').should("be.visible");

    cy.get('[data-cy="size-value-input-err"]').should("be.visible");
  });

  it("Create a new size", () => {
    cy.get('[data-cy="new-size-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(3000);

    cy.get('[data-cy="size-form"]').should("exist");

    cy.get('[data-cy="size-name-input"]')
      .should("be.visible")
      .type("Test size name");

    cy.get('[data-cy="size-value-input"]')
      .should("be.visible")
      .type("Test size value");

    cy.get('[data-cy="size-create-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/sizes`
    );
  });

  it("Update an existing size", () => {
    cy.get(`[data-cy="size-${SIZE_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-update-btn"]`).should("exist").click();

    cy.wait(2000);

    cy.get('[data-cy="size-form"]').should("exist");

    cy.get('[data-cy="size-name-input"]')
      .should("be.visible")
      .clear()
      .type("Test size name update");

    cy.get('[data-cy="size-value-input"]')
      .should("be.visible")
      .clear()
      .type("Test size value update");

    cy.get('[data-cy="size-save-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/sizes`
    );
  });

  it("Cancel delete an existing size", () => {
    cy.get(`[data-cy="size-${SIZE_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-btn"]`).should("exist").click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-cancel"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue delete an existing size", () => {
    cy.get(`[data-cy="size-${SIZE_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-btn"]`).should("exist").click();

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-continue"]`)
      .should("exist")
      .click();

    cy.wait(8000);

    cy.get(`[data-cy="size-${SIZE_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });
});
