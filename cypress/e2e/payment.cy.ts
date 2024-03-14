describe("Cart and payment", () => {
  beforeEach(() => {
    cy.login(Cypress.env("user_email"), Cypress.env("user_password"));

    cy.url({ timeout: 10000 }).should("include", "/");

    cy.get('[data-cy="become-a-seller"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("Add to cart", () => {
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

    //Add to cart
    cy.addToCart();
  });

  it("Should open cart and redirect to Stripe checkout", () => {
    //Cart trigger button
    cy.get('[data-cy="cart-trigger"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    cy.get('[data-cy="cart-content"]', { timeout: 10000 }).should("be.visible");

    cy.get('[data-cy="checkout-btn"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.url({ timeout: 10000 }).should("include", "/checkout");

    cy.get('[data-cy="cart-item-0"]', { timeout: 10000 }).should("be.visible");

    cy.get('[data-cy="stripe-checkout-btn"]').should("not.be.disabled").click();

    cy.window().then((win) => {
      cy.stub(win, "open").as("redirect");

      cy.stub(win.console, "error").as("console.error");
    });
  });

  it("Remove item from cart", () => {
    cy.removeFromCart();
  });
});