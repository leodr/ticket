import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "manifest.json",
      manifest: {
        name: "Semesterticket",
        short_name: "Semesterticket",
        description:
          "Eine einfache App zum Anzeigen und Speichern des Semestertickets.",
        lang: "de",
        start_url: ".",
        display: "standalone",
        orientation: "portrait",
        background_color: "#fff",
        icons: [
          {
            sizes: "48x48",
            src: "./assets/homescreen48.png",
            type: "image/png",
          },
          {
            sizes: "72x72",
            src: "./assets/homescreen72.png",
            type: "image/png",
          },
          {
            sizes: "96x96",
            src: "./assets/homescreen96.png",
            type: "image/png",
          },
          {
            sizes: "144x144",
            src: "./assets/homescreen144.png",
            type: "image/png",
          },
          {
            sizes: "168x168",
            src: "./assets/homescreen168.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "./assets/homescreen192.png",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
