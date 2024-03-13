import "cypress-file-upload";

const formNum = 2;

describe("Update Product Form", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 10000 }).should("be.visible");

    //Go to store page
    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env("auth_storeId")}`
    );

    //Checking if url contains /dashboard
    cy.url().should("include", "/dashboard");
  });

  it("Updating an existing product", () => {
    //Redirect to product page in store.
    cy.get('[data-cy="products-link"]').should("contain", "Products").click();

    //Check if product has a manage button
    cy.get(`[data-cy="${Cypress.env("test_productId")}-trigger"]`)
      .should("be.visible")
      .click();

    //Check if product has a update button
    cy.get(`[data-cy="${Cypress.env("test_productId")}-update"]`)
      .should("be.visible")
      .click();

    //Check if it has an existing text
    cy.get('[data-cy="product-name"]', { timeout: 10000 }).should(
      "not.be.empty"
    );

    //Change the name
    cy.get('[data-cy="product-name"]').clear().type("Nike Air Jordan One Low");

    //change description
    cy.get(".ql-editor")
      .should("not.be.empty")
      .clear()
      .type("Nike Air Max for all men.");

    //Add product item
    cy.get('[data-cy="add-product-item"]').should("be.visible").click();

    //Remove product Item
    cy.get(`[data-cy="product-item-form-${formNum}-remove"]`)
      .should("be.visible")
      .click();

    //Add product item again
    cy.get('[data-cy="add-product-item"]').should("be.visible").click();

    //New product Item Form
    cy.get(`[data-cy="product-item-form-${formNum}"]`)
      .should("be.visible")
      .within(() => {
        //Image Upload
        // cy.get('[data-cy="product-item-form-0-upload-parent"]').should(
        //   "be.visible"
        // );

        // cy.fixture("images/test1.png").then((fileContent) => {
        //   cy.get('[data-cy="product-item-form-0-upload"]').attachFile({
        //     fileContent: fileContent.toString(),
        //     fileName: "test1.png",
        //     mimeType: "image/png",
        //   });
        // });

        //Add Size button
        cy.get(`[data-cy="product-item-form-${formNum}-available-add"]`)
          .should("be.visible")
          .click();

        //Size Form
        cy.get(`[data-cy="product-item-form-${formNum}-available-0"]`)
          .should("be.visible")
          .within(() => {
            //Price
            cy.get('input[placeholder="Price"]')
              .should("be.visible")
              .clear()
              .type("50");

            //Num in stocks
            cy.get('input[placeholder="Number in Stock"]')
              .should("be.visible")
              .clear()
              .type("3");
          });

        //Discount
        cy.get('input[placeholder="Discount"]')
          .should("be.visible")
          .clear()
          .type("10");

        //Color
        cy.get(`[data-cy="product-item-form-${formNum}-color-select"]`)
          .should("be.visible")
          .click()
          .then(($select) => {
            cy.contains(
              `[data-cy^="product-item-form-${formNum}-color-select-"]`,
              "Black",
              {
                timeout: 10000,
              }
            )
              .should("be.visible")
              .click();

            cy.get(
              `[data-cy="product-item-form-${formNum}-color-select"]`
            ).click();
          });
      });

    //Choosing size
    cy.get(`[data-cy="product-item-form-${formNum}-available-0"]`).should(
      "be.visible"
    );

    cy.get(`[data-cy="product-item-form-${formNum}-available-0-size-select"]`)
      .should("be.visible")
      .click();

    cy.get(`[data-cy^="product-item-form-${formNum}-available-select-size-"]`)
      .first()
      .click();

    //Save Product
    cy.get('[data-cy="submit-btn"]').should("be.visible");

    // cy.url({ timeout: 10000 }).should(
    //   "include",
    //   `/dashboard/${Cypress.env("auth_storeId")}/products`
    // );
  });
});
