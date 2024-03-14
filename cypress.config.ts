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
      public_url: process.env.NEXT_TEST_PUBLIC_APP_URL,
      test_productId: process.env.TEST_PRODUCT_ID,
      test_user_productId: process.env.TEST_USER_PRODUCT_ID,
      user_email: process.env.TEST_USER_EMAIL,
      user_password: process.env.TEST_USER_PASSWORD,
      database_url: process.env.TEST_DATABASE_URL,
      direct_url: process.env.TEST_DIRECT_URL,
    },
  },
});
