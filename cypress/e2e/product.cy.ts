import "cypress-file-upload";

describe("Product Form", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.get('[data-cy="go-to-store"]', { timeout: 15000 }).should("be.visible");
  });

  it("Creating a new product", () => {
    //New product route
    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env("auth_storeId")}`
    );

    //Checking if url contains /dashboard
    cy.url().should("include", "/dashboard");

    //Redirect to product page in store.
    cy.get('[data-cy="products-link"]').should("contain", "Products").click();

    //Check if new button exists and click it.
    cy.get('[data-cy="new-product-btn"]', { timeout: 15000 })
      .should("be.visible")
      .click();

    //Product Name
    cy.get('[data-cy="product-name"]', { timeout: 15000 }).should("be.visible");

    cy.get('[data-cy="product-name"]').type("Nike Air Max");

    //Product Description
    cy.get(".ql-editor").should("be.visible");

    cy.get(".ql-editor").type("Nike Air Max for men.");

    //Add product item button
    cy.get('[data-cy="add-product-item"]').should("be.visible").click();

    //Remove product Item
    cy.get('[data-cy="product-item-form-0-remove"]')
      .should("be.visible")
      .click();

    //Add product item button
    cy.get('[data-cy="add-product-item"]').should("be.visible").click();

    //Product Item Form
    cy.get('[data-cy="product-item-form-0"]')
      .should("be.visible")
      .within(() => {
        //Image Upload
        cy.get('[data-cy="product-item-form-0-upload-parent"]').should(
          "be.visible"
        );

        cy.fixture("images/test1.png").then((fileContent) => {
          cy.get('[data-cy="product-item-form-0-upload"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: "test1.png",
            mimeType: "image/png",
            encoding: "base64",
          });
        });

        //Add Size button
        cy.get('[data-cy="product-item-form-0-available-add"]')
          .should("be.visible")
          .click();

        //Size Form
        cy.get('[data-cy="product-item-form-0-available-0"]')
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
        cy.get('[data-cy="product-item-form-0-color-select"]', {
          timeout: 10000,
        })
          .should("be.visible")
          .click()
          .then(($select) => {
            cy.contains(
              '[data-cy^="product-item-form-0-color-select-"]',
              "Black",
              {
                timeout: 10000,
              }
            )
              .should("be.visible")
              .click();

            cy.get('[data-cy="product-item-form-0-color-select"]').click();
          });
      });

    //Choosing size
    cy.get('[data-cy="product-item-form-0-available-0"]').should("be.visible");

    cy.get('[data-cy="product-item-form-0-available-0-size-select"]')
      .should("be.visible")
      .click();

    cy.get('[data-cy^="product-item-form-0-available-select-size-"]')
      .first()
      .click();

    //Category
    cy.get('[data-cy="product-select"]').should("be.visible").click();

    cy.get('[data-cy^="product-0"]')
      .should("be.visible")
      .click({ force: true });

    //Create Product
    cy.get('[data-cy="create-btn"]')
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 80000 }).should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/products`
    );
  });
});
