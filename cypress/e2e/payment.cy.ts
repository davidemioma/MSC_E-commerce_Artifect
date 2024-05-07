describe("Cart and payment", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.wait(15000);

    cy.url().should("include", "/");

    cy.get('[data-cy="become-a-seller"]').should("exist");

    cy.wait(10000);
  });

  it("Add to cart", () => {
    //Ensure there is a product
    cy.get(`[data-cy="feed-product-${Cypress.env("test_user_productId")}"]`)
      .should("be.visible")
      .click();

    cy.wait(10000);

    //Redirect to product details page.
    cy.url().should(
      "include",
      `/products/${Cypress.env("test_user_productId")}`
    );

    //Add to cart
    cy.addToCart();
  });

  it("Should open cart and redirect to Stripe checkout", () => {
    //Cart trigger button
    cy.get('[data-cy="cart-trigger"]').should("be.visible").click();

    cy.wait(10000);

    cy.get('[data-cy="cart-content"]').should("be.visible");

    cy.get('[data-cy="checkout-btn"]').should("be.visible").click();

    cy.wait(15000);

    cy.url().should("include", "/checkout");

    cy.wait(5000);

    cy.get('[data-cy="cart-item-0"]').should("be.visible");

    cy.get('[data-cy="stripe-checkout-btn"]').should("not.be.disabled");
  });

  it("Remove item from cart", () => {
    cy.removeFromCart();
  });
});
