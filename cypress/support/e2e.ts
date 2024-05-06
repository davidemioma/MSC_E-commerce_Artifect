// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("uncaught:exception", (err, runnable) => {
  // Check if the error is the specific NEXT_REDIRECT error
  if (err.message.includes("NEXT_REDIRECT")) {
    // Return false to prevent Cypress from failing the test
    return false;
  }

  if (err.message.includes("document is not defined")) {
    // Return false to prevent Cypress from failing the test
    return false;
  }

  if (
    err.message.includes("Text content does not match server-rendered HTML")
  ) {
    // Return false to prevent Cypress from failing the test
    return false;
  }

  // Return true to let Cypress handle other uncaught exceptions normally
  return true;
});
