const COLOR_INDEX = 0;

describe("Color for store", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 15000 }).should("be.visible");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/colors`
    );
  });

  it("Create fail for invalid form", () => {
    cy.get('[data-cy="new-color-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(3000);

    cy.get('[data-cy="color-form"]').should("exist");

    cy.get('[data-cy="color-create-btn"]').should("be.visible").click();

    cy.get('[data-cy="color-name-input-err"]').should("be.visible");

    cy.get('[data-cy="color-value-input-err"]').should("be.visible");
  });

  it("Create a new color", () => {
    cy.get('[data-cy="new-color-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(3000);

    cy.get('[data-cy="color-form"]').should("exist");

    cy.get('[data-cy="color-name-input"]')
      .should("be.visible")
      .type("Test color name");

    cy.get('[data-cy="color-value-input"] .flexbox-fix > div > div')
      .first()
      .click();

    cy.get('[data-cy="color-create-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/colors`
    );
  });

  it("Update an existing color", () => {
    cy.get(`[data-cy="color-${COLOR_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-update-btn"]`)
      .should("exist")
      .click();

    cy.wait(2000);

    cy.get('[data-cy="color-form"]').should("exist");

    cy.get('[data-cy="color-name-input"]')
      .should("be.visible")
      .clear()
      .type("Test color name update");

    cy.get('[data-cy="color-value-input"] .flexbox-fix > div > div')
      .first()
      .click();

    cy.get('[data-cy="color-save-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/colors`
    );
  });

  it("Cancel delete an existing color", () => {
    cy.get(`[data-cy="color-${COLOR_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-cancel"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue delete an existing color", () => {
    cy.get(`[data-cy="color-${COLOR_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-continue"]`)
      .should("exist")
      .click();

    cy.wait(8000);

    cy.get(`[data-cy="color-${COLOR_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });
});
