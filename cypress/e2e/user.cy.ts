describe("Users Interactions", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.wait(15000);

    cy.url().should("include", "/");

    cy.get('[data-cy="become-a-seller"]').should("be.visible");

    //Ensure there is a product
    cy.get(`[data-cy="feed-product-${Cypress.env("test_user_productId")}"]`)
      .should("be.visible")
      .click();

    cy.wait(15000);

    //Redirect to product details page.
    cy.url().should(
      "include",
      `/products/${Cypress.env("test_user_productId")}`
    );

    cy.wait(15000);
  });

  it("Add to Cart Functions", () => {
    //Select size
    cy.addToCart();
  });

  it("Should open cart", () => {
    //Cart trigger button
    cy.get('[data-cy="cart-trigger"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    cy.wait(10000);

    cy.get('[data-cy="cart-content"]').should("be.visible");
  });

  it("Increase and decrease quality should be visible", () => {
    //Cart trigger button
    cy.get('[data-cy="cart-trigger"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    cy.get('[data-cy="cart-content"]').should("be.visible");

    cy.wait(15000);

    cy.get('[data-cy="cart-item-0"]').should("be.visible");

    cy.get('[data-cy="cart-item-0-add"]').should("be.visible");

    cy.get('[data-cy="cart-item-0-minus"]').should("be.visible");
  });

  it("Remove item from cart", () => {
    cy.removeFromCart();
  });

  it("Should show error message when submitting review invalid form", () => {
    //There should be a review form
    cy.get(`[data-cy="review-form-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    }).should("exist");

    //Get submit review button
    cy.get(`[data-cy="submit-review-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    })
      .should("exist")
      .click();

    cy.wait(10000);

    //Error messages
    cy.get(`[data-cy="star-err-${Cypress.env("test_user_productId")}"]`).should(
      "exist"
    );

    cy.get(
      `[data-cy="reason-err-${Cypress.env("test_user_productId")}"]`
    ).should("exist");

    cy.get(
      `[data-cy="comment-err-${Cypress.env("test_user_productId")}"]`
    ).should("exist");
  });
});
