// app.config.ts
import { createApp } from "vinxi";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
var app_config_default = createApp({
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public"
    },
    {
      name: "client",
      type: "client",
      handler: "./src/client.tsx",
      target: "browser",
      plugins: () => [tanstackStart()],
      base: "/_build"
    },
    {
      name: "ssr",
      type: "handler",
      handler: "./src/ssr.tsx",
      target: "server",
      plugins: () => [tanstackStart()]
    }
  ]
});
export {
  app_config_default as default
};
