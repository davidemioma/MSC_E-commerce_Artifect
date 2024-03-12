import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      auth_storeId: process.env.TEST_STORE_ID,
      auth_email: process.env.TEST_EMAIL,
      auth_password: process.env.TEST_PASSWORD,
      public_url:
        process.env.NODE_ENV === "production"
          ? "https://localmart-eight.vercel.app"
          : "http://localhost:3000",
    },
  },
});