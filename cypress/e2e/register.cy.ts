describe("Register Form", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("public_url")}/auth/sign-up`);
  });

  it("Should display the registration form", () => {
    cy.get("p").should("contain", "Create an account");

    cy.get('input[placeholder="David..."]').should("be.visible");

    cy.get('input[placeholder="email@example.com"]').should("be.visible");

    cy.get('input[placeholder="******"]').should("be.visible");

    cy.get("button").should("contain", "Create an account");

    cy.get('[data-cy="back-btn"]').should("be.visible");
  });

  it("Should show error message when submitting invalid form", () => {
    cy.get('[data-cy="create-acc-btn"]')
      .should("contain", "Create an account")
      .click();

    cy.get('[data-cy="error-name"]').should("be.visible");

    cy.get('[data-cy="error-email"]').should("be.visible");

    cy.get('[data-cy="error-password"]').should("be.visible");
  });

  it("should redirect to the appropriate page if user click already have an account", () => {
    cy.get('[data-cy="back-btn"]').click();

    cy.url().should("include", "/auth/sign-in");
  });
});
