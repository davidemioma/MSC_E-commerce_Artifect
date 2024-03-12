describe("Login Form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/sign-in");
  });

  it("Should display the login form", () => {
    cy.get("p").should("contain", "Welcome back");

    cy.get('input[placeholder="email@example.com"]').should("be.visible");

    cy.get('input[placeholder="******"]').should("be.visible");

    cy.get('[data-cy="forgot-password-btn"]').should("be.visible");

    cy.get('[data-cy="sign-in-btn"]').should("be.visible");

    cy.get('[data-cy="back-btn"]').should("be.visible");
  });

  it("should redirect to the appropriate page if user click forgot password", () => {
    cy.get('[data-cy="forgot-password-btn"]').click();

    cy.url().should("include", "/auth/reset-password");
  });

  it("should redirect to the appropriate page if user click don't have an account", () => {
    cy.get('[data-cy="back-btn"]').click();

    cy.url().should("include", "/auth/sign-up");
  });

  it("Should show error message when submitting invalid form", () => {
    cy.get('[data-cy="sign-in-btn"]').should("be.visible").click();

    cy.get('[data-cy="error-email"]').should("be.visible");

    cy.get('[data-cy="error-password"]').should("be.visible");
  });

  it("should redirect to the appropriate page after successful login", () => {
    cy.get('input[placeholder="email@example.com"]').type(
      Cypress.env("auth_email")
    );

    cy.get('input[placeholder="******"]').type(Cypress.env("auth_password"));

    cy.get('[data-cy="sign-in-btn"]').click();

    cy.url().should("include", "/");
  });
});
