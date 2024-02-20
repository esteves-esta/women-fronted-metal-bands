import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    // base: mode === "production" ? "/women-fronted-metal-bands/" : "",
    plugins: [react()],
    assetsInclude: ["**/*.JPG"],
    //  testing cors on personal proxy server and error handler
    // server: {
    //   port: 3401
    // }
  };
  return config;
});
