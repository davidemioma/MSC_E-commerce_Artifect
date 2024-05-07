import "cypress-file-upload";

const BANNER_INDEX = 0;

const ACTIVE_BANNER_INDEX = 1;

describe("Banner", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.wait(15000);

    cy.get('[data-cy="go-to-store"]').should("be.visible");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/banners`
    );

    cy.wait(15000);
  });

  it("Create fail for invalid form", () => {
    cy.get('[data-cy="new-banner-btn"]').should("be.visible").click();

    cy.get('[data-cy="banner-form"]').should("exist");

    cy.get('[data-cy="banner-create-btn"]').should("be.visible").click();

    cy.get('[data-cy="banner-name-input-err"]').should("be.visible");

    cy.get('[data-cy="banner-img-input-err"]').should("be.visible");
  });

  it("Create a new banner", () => {
    cy.get('[data-cy="new-banner-btn"]').should("be.visible").click();

    cy.get('[data-cy="banner-form"]').should("exist");

    cy.fixture("images/test1.png").then((fileContent) => {
      cy.get('[data-cy="banner-upload"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "test1.png",
        mimeType: "image/png",
        encoding: "base64",
      });
    });

    //Waiting for image to be uploaded
    cy.wait(10000);

    cy.get('[data-cy="banner-name-input"]')
      .should("be.visible")
      .type("Test Banner");

    cy.get('[data-cy="banner-create-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait(10000);

    cy.url().should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/banners`
    );
  });

  it("Update a new banner", () => {
    cy.get(`[data-cy="banner-${BANNER_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="banner-${BANNER_INDEX}-update-btn"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get('[data-cy="banner-form"]').should("exist");

    cy.get('[data-cy="banner-name-input"]')
      .should("be.visible")
      .clear()
      .type("Test Banner Update");

    cy.get('[data-cy="banner-save-btn"]').should("be.visible").click();

    cy.wait(10000);

    cy.url().should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/banners`
    );
  });

  it("Cancel set banner to active", () => {
    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-cancel"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue set banner to active", () => {
    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-continue"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="banner-${ACTIVE_BANNER_INDEX}-active-continue"]`).should(
      "not.exist"
    );
  });

  it("Cancel delete an existing banner", () => {
    cy.get(`[data-cy="banner-${BANNER_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-cancel"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue delete an existing banner", () => {
    cy.get(`[data-cy="banner-${BANNER_INDEX}-trigger"]`, {
      timeout: 15000,
    })
      .should("be.visible")
      .click();

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-continue"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="banner-${BANNER_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });
});
