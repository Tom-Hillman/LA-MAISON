import type { Express } from "express";
import express from "express";
import path from "path";

export function serveStatic(app: Express) {
  // Vite builds to dist/public
  const publicDir = path.resolve(process.cwd(), "dist", "public");

  // Serve at root
  app.use(express.static(publicDir, { index: false }));

  // ALSO serve under /LA-MAISON for backwards compatibility
  // (in case index.html was built with base "/LA-MAISON/")
  app.use("/LA-MAISON", express.static(publicDir, { index: false }));

  // SPA fallback for /LA-MAISON routes
  app.get("/LA-MAISON/*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  // SPA fallback for root routes
  app.get("*", (req, res) => {
    // don't hijack real file requests
    if (req.path.includes(".")) return res.status(404).end();
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
