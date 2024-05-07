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

    cy.wait(10000);

    //Redirect to product details page.
    cy.url().should(
      "include",
      `/products/${Cypress.env("test_user_productId")}`
    );

    cy.wait(10000);
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
      `/stores/${Cypress.env("auth_storeId")}`
    );
  });

  it("It should display to search bar", () => {
    cy.get('[data-cy="view-store-link"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar"]').should("be.visible");

    cy.get('[data-cy="store-product-search-bar-input"]').should("exist");
  });

  it("Should clear input on clear btn clicked", () => {
    cy.get('[data-cy="view-store-link"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar-input"]')
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-clear"]')
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar-input"]').should("be.empty");
  });

  it("Should redirect on search btn clicked", () => {
    cy.get('[data-cy="view-store-link"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar-input"]')
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-search"]')
      .should("exist")
      .first()
      .click();

    cy.wait(10000);

    cy.url().should("include", "?search=test");
  });

  it("Should show no result for product that does not exists", () => {
    cy.get('[data-cy="view-store-link"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar-input"]')
      .should("exist")
      .type("test");

    cy.get('[data-cy="store-product-search-bar-input-search"]').first().click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-empty"]').should("exist");
  });

  it("Should show result for product that exist", () => {
    cy.get('[data-cy="view-store-link"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-bar-input"]')
      .should("exist")
      .type("Nike Air Jordan");

    cy.get('[data-cy="store-product-search-bar-input-search"]').first().click();

    cy.wait(10000);

    cy.get('[data-cy="store-product-search-empty"]').should("not.exist");
  });
});
