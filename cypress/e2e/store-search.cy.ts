describe("Users Interactions", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.url({ timeout: 10000 }).should("include", "/");

    cy.get('[data-cy="become-a-seller"]', { timeout: 10000 }).should(
      "be.visible"
    );

    //Ensure there is a product
    cy.get(`[data-cy="feed-product-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    //Redirect to product details page.
    cy.url({ timeout: 16000 }).should(
      "include",
      `/products/${Cypress.env("test_user_productId")}`
    );
  });

  it("Ensure there is a store for a product", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 }).should("exist");
  });

  it("It should redirect to store when clicked", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.url({ timeout: 16000 }).should(
      "include",
      `/products/${Cypress.env("test_user_productId")}/stores`
    );
  });

  it("It should display to search bar", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar"]', { timeout: 10000 }).should(
      "be.visible"
    );

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    }).should("exist");
  });

  it("Should clear input on clear btn clicked", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    })
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-clear"]')
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    }).should("be.empty");
  });

  it("Should redirect on search btn clicked", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    })
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-search"]')
      .should("exist")
      .first()
      .click();

    cy.url({ timeout: 10000 }).should("include", "?search=test");
  });

  it("Should show no result for product that does not exists", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    })
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-search"]').first().click();

    cy.get('[data-cy="store-product-search-empty"]').should("exist");
  });

  it("Should show result for product that exist", () => {
    cy.get('[data-cy="view-store-link"]', { timeout: 10000 })
      .should("exist")
      .click();

    cy.get('[data-cy="store-product-search-bar-input"]', {
      timeout: 10000,
    })
      .should("exist")
      .type("Nike Air Jordan");

    cy.get('[data-cy="store-product-search-bar-input-search"]').first().click();

    cy.get('[data-cy="product-search-result-text"]').should("not.exist");
  });
});
