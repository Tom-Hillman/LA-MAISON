import type { Express } from "express";
import express from "express";
import path from "path";

export function serveStatic(app: Express) {
  // Vite outputs to dist/public (because vite.config.ts outDir points there)
  const publicDir = path.resolve(process.cwd(), "dist", "public");

  // Serve assets like /assets/index-xxxx.js
  app.use(express.static(publicDir));

  // SPA fallback for client-side routes (e.g. /properties/LM-001)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
