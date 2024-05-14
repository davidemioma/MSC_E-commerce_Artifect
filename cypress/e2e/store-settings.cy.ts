import "cypress-file-upload";

describe("Store Settings", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.wait(15000);

    cy.get('[data-cy="go-to-store"]').should("be.visible");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/settings`,
      { failOnStatusCode: false }
    );

    cy.wait(15000);
  });

  it("Store settings status and form should be visible", () => {
    cy.get('[data-cy="store-status"]').should("exist");

    cy.get('[data-cy="store-settings-form"]').should("exist");
  });

  it("Store settings details should be visible", () => {
    cy.get('[data-cy="store-image-upload"]').should("exist");

    cy.get('[data-cy="store-name-input"]').should("exist");

    cy.get('[data-cy="store-country-select-trigger"]').should("exist");

    cy.get('[data-cy="store-postcode-input"]').should("exist");

    cy.get('[data-cy="store-description-input"]').should("exist");

    cy.get('[data-cy="save-store-details"]').should("exist");
  });

  it("Invalid country and postcode", () => {
    cy.get('[data-cy="store-postcode-input"]')
      .should("exist")
      .clear()
      .type("102");

    cy.get('[data-cy="save-store-details"]').should("exist").click();

    cy.get('[data-cy="save-store-details"]').should("be.disabled");

    cy.wait(10000);

    cy.get('[data-cy="invalid-err"]').should("exist");
  });

  it("Update store settings details", () => {
    cy.fixture("images/store.png").then((fileContent) => {
      cy.get('[data-cy="store-image-upload"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "store.png",
        mimeType: "image/png",
        encoding: "base64",
      });
    });

    cy.wait(15000);

    cy.get('[data-cy="store-name-input"]')
      .should("exist")
      .clear()
      .type("David's Sneaker Store");

    cy.get('[data-cy="store-postcode-input"]')
      .should("exist")
      .clear()
      .type("AL109WX");

    cy.get('[data-cy="store-description-input"]')
      .should("exist")
      .clear()
      .type("We have all the best sneakers.");

    cy.get('[data-cy="save-store-details"]').should("exist").click();

    cy.get('[data-cy="save-store-details"]').should("be.disabled");

    cy.wait(15000);

    cy.get('[data-cy="invalid-err"]').should("not.exist");
  });
});
