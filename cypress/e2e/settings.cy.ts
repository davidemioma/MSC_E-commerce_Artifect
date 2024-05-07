import "cypress-file-upload";

describe("Settings", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.wait(15000);

    cy.get('[data-cy="go-to-store"]').should("be.visible");

    cy.visit(`${Cypress.env("public_url")}/settings`);

    cy.wait(15000);
  });

  it("Settings form should be visible", () => {
    cy.get('[data-cy="user-settings-form"]').should("be.visible");
  });

  it("Settings details should be visible", () => {
    cy.get('[data-cy="user-settings-image-upload"]').should("exist");

    cy.get('[data-cy="user-settings-name-input"]').should("exist");

    cy.get('[data-cy="user-settings-password-input"]').should("exist");

    cy.get('[data-cy="user-settings-new-password-input"]').should("exist");

    cy.get('[data-cy="user-settings-2fa-input"]').should("exist");
  });

  it("Show error for invalid passord", () => {
    cy.get('[data-cy="user-settings-password-input"]')
      .should("exist")
      .type("1");

    cy.get('[data-cy="user-settings-new-password-input"]')
      .should("exist")
      .type("1");

    cy.get('[data-cy="user-settings-save-btn"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="user-settings-new-password-input-err"]').should("exist");
  });

  it("Update user details", () => {
    cy.get('[data-cy="user-settings-name-input"]')
      .should("exist")
      .clear()
      .type("David Junior");

    cy.fixture("images/user.png").then((fileContent) => {
      cy.get('[data-cy="user-settings-image-upload"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "user.png",
        mimeType: "image/png",
        encoding: "base64",
      });
    });

    cy.wait(10000);

    cy.get('[data-cy="user-settings-save-btn"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="user-settings-update-success"]').should("exist");
  });

  it("Go to store button should exist if User role is SELLER", () => {
    cy.get('[data-cy="user-settings-secondary-btn"]').should("exist");
  });

  it("Logout button should exists", () => {
    cy.get('[data-cy="user-settings-signout-btn"]').should("exist");
  });
});
