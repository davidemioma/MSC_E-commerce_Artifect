describe("Users Interactions", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.url({ timeout: 10000 }).should("include", "/");

    cy.get('[data-cy="become-a-seller"]', { timeout: 10000 }).should(
      "be.visible"
    );

    //Ensure there is a product
    cy.get(`[data-cy="feed-product-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    //Redirect to product details page.
    cy.url({ timeout: 16000 }).should(
      "include",
      `/products/${Cypress.env("test_user_productId")}`
    );
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

    cy.get('[data-cy="cart-item-0"]', { timeout: 15000 }).should("be.visible");

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

    //Error messages
    cy.get(`[data-cy="star-err-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="reason-err-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    }).should("exist");

    cy.get(`[data-cy="comment-err-${Cypress.env("test_user_productId")}"]`, {
      timeout: 10000,
    }).should("exist");
  });
});