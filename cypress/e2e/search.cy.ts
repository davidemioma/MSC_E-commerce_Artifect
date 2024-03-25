describe("Search For Products", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.url({ timeout: 10000 }).should("include", "/");

    cy.get('[data-cy="become-a-seller"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("Search bar should exists", () => {
    cy.get('[data-cy="product-search-bar"]', { timeout: 10000 }).should(
      "be.visible"
    );

    cy.get('[data-cy="product-search-bar-input"]', { timeout: 10000 }).should(
      "exist"
    );
  });

  it("Should clear input on clear btn clicked", () => {
    cy.get('[data-cy="product-search-bar-input"]').first().type("test product");

    cy.get('[data-cy="product-search-bar-input-clear"]')
      .should("exist")
      .click();

    cy.get('[data-cy="product-search-bar-input"]').should("be.empty");
  });

  it("Should redirect on search btn clicked", () => {
    cy.get('[data-cy="product-search-bar-input"]').first().type("test");

    cy.get('[data-cy="product-search-bar-input-search"]')
      .should("exist")
      .first()
      .click();

    cy.url({ timeout: 10000 }).should("include", "/products/search?query=test");
  });

  it("Should show no result for product that does not exists", () => {
    cy.get('[data-cy="product-search-bar-input"]').first().type("test");

    cy.get('[data-cy="product-search-bar-input-search"]').first().click();

    cy.get('[data-cy="product-search-empty"]').should("exist");
  });

  it("Should show result for product that exist", () => {
    cy.get('[data-cy="product-search-bar-input"]')
      .first()
      .type("Nike Air Jordan");

    cy.get('[data-cy="product-search-bar-input-search"]').first().click();

    cy.get('[data-cy="product-search-result-text"]').should("exist");
  });
});
