// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  preview: {
    allowedHosts: ["sandjayacorp.com", "www.sandjayacorp.com", "app.sandjayacorp.com", "api.sandjayacorp.com"]
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
