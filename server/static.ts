import type { Express } from "express";
import express from "express";
import path from "path";

export function serveStatic(app: Express) {
  // Vite builds to dist/public
  const publicDir = path.resolve(process.cwd(), "dist", "public");

  // Serve /assets/* and any other static files from dist/public
  app.use(express.static(publicDir, { index: false }));

  // SPA fallback: serve index.html for non-file routes
  app.get("*", (req, res) => {
    // Don’t hijack actual file requests (like .js, .css, .png, etc.)
    if (req.path.includes(".")) {
      return res.status(404).end();
    }

    res.sendFile(path.join(publicDir, "index.html"));
  });
}
