const CATEGORY_INDEX = 0;

describe("Category for store", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 15000 }).should("be.visible");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/categories`
    );
  });

  it("Create fail for invalid form", () => {
    cy.get('[data-cy="new-category-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(2000);

    cy.get('[data-cy="category-form"]').should("exist");

    cy.get('[data-cy="category-create-btn"]').should("be.visible").click();

    cy.get('[data-cy="category-name-input-err"]').should("be.visible");
  });

  it("Create a new category", () => {
    cy.get('[data-cy="new-category-btn"]', {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.wait(2000);

    cy.get('[data-cy="category-form"]').should("exist");

    cy.get('[data-cy="category-name-input"]')
      .should("be.visible")
      .type("Test Category");

    cy.get('[data-cy="category-create-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/categories`
    );
  });

  it("Update an existing category", () => {
    cy.get(`[data-cy="category-${CATEGORY_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-update-btn"]`)
      .should("exist")
      .click();

    cy.wait(2000);

    cy.get('[data-cy="category-form"]').should("exist");

    cy.get('[data-cy="category-name-input"]')
      .should("be.visible")
      .clear()
      .type("Test Category Update");

    cy.get('[data-cy="category-save-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/categories`
    );
  });

  it("Cancel delete an existing category", () => {
    cy.get(`[data-cy="category-${CATEGORY_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-cancel"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue delete an existing category", () => {
    cy.get(`[data-cy="category-${CATEGORY_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-continue"]`)
      .should("exist")
      .click();

    cy.wait(8000);

    cy.get(`[data-cy="category-${CATEGORY_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });
});
