import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    env: {
      auth_storeId: process.env.TEST_STORE_ID,
      auth_email: process.env.TEST_EMAIL,
      auth_password: process.env.TEST_PASSWORD,
      test_productId: process.env.TEST_PRODUCT_ID,
      test_user_productId: process.env.TEST_USER_PRODUCT_ID,
      user_email: process.env.TEST_USER_EMAIL,
      user_password: process.env.TEST_USER_PASSWORD,
      public_url: process.env.CYPRESS_BASE_URL,

      vercel_session_id: process.env.VERCEL_PREVIEW_SESSION_ID,
      vercel_vc_session_id: process.env.VERCEL_PREVIEW_VC_SESSION_ID,
      vercel_authorisaion_id: process.env.VERCEL_PREVIEW_AUTHORISATION_ID,
      vercel_jwt: process.env.VERCEL_PREVIEW_JWT,
    },
  },
});
