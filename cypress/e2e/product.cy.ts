import "cypress-file-upload";

const PRODUCT_INDEX = 0;

const PRODUCT_ITEM_DELETE_INDEX = 0;

const PRODUCT_ITEM_ADD_INDEX = 0;

describe("Product for store", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth_email"), Cypress.env("auth_password"));

    cy.wait(15000);

    cy.get('[data-cy="go-to-store"]').should("exist");

    cy.visit(
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/products`
    );

    cy.wait(15000);
  });

  it("Display fail for invalid form", () => {
    cy.get('[data-cy="new-product-btn"]').should("exist").click();

    cy.wait(10000);

    cy.get('[data-cy="product-form"]').should("exist");

    cy.get('[data-cy="product-create-btn"]').should("exist").click();

    cy.get('[data-cy="product-name-input-err"]').should("exist");

    cy.get('[data-cy="product-category-input-err"]').should("exist");

    cy.get('[data-cy="product-description-input-err"]').should("exist");
  });

  it("Create a new product", () => {
    cy.get('[data-cy="new-product-btn"]').should("be.visible").click();

    cy.wait(15000);

    cy.get('[data-cy="product-form"]').should("exist");

    cy.get('[data-cy="product-name-input"]')
      .should("exist")
      .type("Test product");

    //Product Description
    cy.get('[data-cy="product-description-input"]')
      .should("exist")
      .type("Test product description");

    //Category
    cy.get('[data-cy="product-category-select-trigger"]')
      .should("exist")
      .click();

    //Wait for category to be loaded
    cy.wait(10000);

    cy.get('[data-cy^="product-category-select-0"]')
      .should("exist")
      .click({ force: true });

    //Wait for category to be selected
    cy.wait(10000);

    //Add product item button
    cy.get('[data-cy="add-product-item"]').should("exist").click();

    cy.wait(10000);

    //Product Item Form
    cy.get('[data-cy="product-item-form-0"]')
      .should("exist")
      .within(() => {
        //Image Upload
        cy.get('[data-cy="product-item-form-0-upload-parent"]').should("exist");

        cy.fixture("images/test1.png").then((fileContent) => {
          cy.get('[data-cy="product-item-form-0-upload"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: "test1.png",
            mimeType: "image/png",
            encoding: "base64",
          });
        });

        //Wait for image to upload
        cy.wait(10000);

        //Add Size button
        cy.get('[data-cy="product-item-form-0-available-add"]')
          .should("exist")
          .click();

        cy.wait(3000);

        //Size Form
        cy.get('[data-cy="product-item-form-0-available-0"]')
          .should("exist")
          .within(() => {
            //Price
            cy.get('input[placeholder="Price"]')
              .should("exist")
              .clear()
              .type("50");

            //Num in stocks
            cy.get('input[placeholder="Number in Stock"]')
              .should("exist")
              .clear()
              .type("3");
          });

        //Discount
        cy.get('input[placeholder="Discount"]')
          .should("exist")
          .clear()
          .type("10");

        //Color
        cy.get('[data-cy="product-item-form-0-color-select"]', {
          timeout: 10000,
        })
          .should("exist")
          .click()
          .then(($select) => {
            //Wait for colors to load
            cy.wait(10000);

            cy.contains(
              '[data-cy^="product-item-form-0-color-select-"]',
              "Black",
              {
                timeout: 10000,
              }
            )
              .should("exist")
              .click();

            cy.get('[data-cy="product-item-form-0-color-select"]').click();
          });
      });

    //Choosing size
    cy.get('[data-cy="product-item-form-0-available-0"]').should("exist");

    cy.get('[data-cy="product-item-form-0-available-0-size-select"]')
      .should("exist")
      .click();

    //Wait for sizes to load
    cy.wait(10000);

    cy.get('[data-cy^="product-item-form-0-available-select-size-"]')
      .first()
      .click();

    //Create Product
    cy.get('[data-cy="product-create-btn"]')
      .should("exist")
      .click({ force: true });

    cy.wait(10000);

    cy.url().should(
      "eq",
      `${Cypress.env("public_url")}/dashboard/${Cypress.env(
        "auth_storeId"
      )}/products`
    );
  });

  it("Update an existing product", () => {
    cy.wait(10000);

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-trigger"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-update-btn"]`)
      .should("exist")
      .click();

    cy.wait(15000);

    cy.get('[data-cy="product-form"]').should("exist");

    cy.wait(10000);

    //delete product item
    cy.get(`[data-cy="product-item-form-${PRODUCT_ITEM_DELETE_INDEX}-delete"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="product-item-form-${PRODUCT_ITEM_DELETE_INDEX}"]`).should(
      "not.exist"
    );

    //Product Name
    cy.get('[data-cy="product-name-input"]')
      .should("exist")
      .clear()
      .type("Test product update");

    //Product Description
    cy.get('[data-cy="product-description-input"]')
      .should("exist")
      .clear()
      .type("Test product description update");

    //Category
    cy.get('[data-cy="product-category-select-trigger"]')
      .should("exist")
      .click();

    //Wait for category to be loaded
    cy.wait(10000);

    cy.get('[data-cy^="product-category-select-1"]')
      .should("exist")
      .click({ force: true });

    //Wait for category to be selected
    cy.wait(10000);

    //Add product item
    cy.get('[data-cy="add-product-item"]').should("exist").click();

    //Remove product Item
    cy.get(`[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-remove"]`)
      .should("exist")
      .click();

    //Add product item again
    cy.get('[data-cy="add-product-item"]').should("exist").click();

    //New product Item Form
    cy.get(`[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}"]`)
      .should("exist")
      .within(() => {
        //Image Upload
        cy.get(
          `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-upload-parent"]`
        ).should("exist");

        cy.fixture("images/test1.png").then((fileContent) => {
          cy.get(
            `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-upload"]`
          ).attachFile({
            fileContent: fileContent.toString(),
            fileName: "test1.png",
            mimeType: "image/png",
            encoding: "base64",
          });
        });

        //Wait for image to upload
        cy.wait(10000);

        //Add Size button
        cy.get(
          `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-available-add"]`
        )
          .should("exist")
          .click();

        //Size Form
        cy.get(
          `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-available-0"]`
        )
          .should("exist")
          .within(() => {
            //Price
            cy.get('input[placeholder="Price"]')
              .should("exist")
              .clear()
              .type("50");

            //Num in stocks
            cy.get('input[placeholder="Number in Stock"]')
              .should("exist")
              .clear()
              .type("3");
          });

        //Discount
        cy.get('input[placeholder="Discount"]')
          .should("exist")
          .clear()
          .type("10");

        //Color
        cy.get(
          `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-color-select"]`
        )
          .should("exist")
          .click()
          .then(($select) => {
            //Wait for colors to load
            cy.wait(10000);

            cy.contains(
              `[data-cy^="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-color-select-"]`,
              "Black"
            )
              .should("exist")
              .click();

            cy.get(
              `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-color-select"]`
            ).click();

            //Wait for colors to be selected
            cy.wait(10000);
          });
      });

    //Choosing size
    cy.get(
      `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-available-0"]`
    ).should("exist");

    cy.get(
      `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-available-0-size-select"]`
    )
      .should("exist")
      .click();

    //Wait for size to load
    cy.wait(10000);

    cy.get(
      `[data-cy^="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-available-select-size-"]`
    )
      .first()
      .click();

    //Wait for size to be selected
    cy.wait(10000);

    //Save product
    cy.get('[data-cy="product-save-btn"]')
      .should("exist")
      .click({ force: true });

    cy.wait(10000);

    //Expect a new product item
    cy.get(
      `[data-cy="product-item-form-${PRODUCT_ITEM_ADD_INDEX}-delete"]`
    ).should("exist");

    //Back to products
    cy.get('[data-cy="back-btn"]')
      .should("contain", "Back to products")
      .click();
  });

  it("Cancel alert for delete an existing product", () => {
    cy.get(`[data-cy="product-${PRODUCT_INDEX}-trigger"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-cancel"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });

  it("Continue to delete an existing product", () => {
    cy.get(`[data-cy="product-${PRODUCT_INDEX}-trigger"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-btn"]`)
      .should("exist")
      .click();

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-continue"]`)
      .should("exist")
      .click();

    cy.wait(10000);

    cy.get(`[data-cy="product-${PRODUCT_INDEX}-delete-continue"]`).should(
      "not.exist"
    );
  });
});
