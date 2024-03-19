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

    cy.get('[data-cy="error-name"]', { timeout: 10000 }).should("be.visible");

    cy.get('[data-cy="error-email"]', { timeout: 10000 }).should("be.visible");

    cy.get('[data-cy="error-password"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("Should show check for invalid password", () => {
    cy.get('input[placeholder="David..."]')
      .should("be.visible")
      .type("Test User");

    cy.get('input[placeholder="email@example.com"]')
      .should("be.visible")
      .type(`${Cypress.env("user_email")}`);

    cy.get('input[placeholder="******"]')
      .should("be.visible")
      .type("12", { log: false });

    cy.get('[data-cy="create-acc-btn"]')
      .should("contain", "Create an account")
      .click();

    cy.get('[data-cy="error-password"]').should("be.visible");
  });

  it("Should either register a new user successfully or fail if the user already exists", () => {
    cy.get('input[placeholder="David..."]')
      .should("be.visible")

      .type("Test User");

    cy.get('input[placeholder="email@example.com"]')
      .should("be.visible")
      .type(`${Cypress.env("user_email")}`);

    cy.get('input[placeholder="******"]')
      .should("be.visible")
      .type(`${Cypress.env("user_password")}`, { log: false });

    cy.get('[data-cy="create-acc-btn"]')
      .should("contain", "Create an account")
      .click();
  });

  it("should redirect to the appropriate page if user click already have an account", () => {
    cy.get('[data-cy="back-btn"]').click();

    cy.url().should("include", "/auth/sign-in");
  });
});
