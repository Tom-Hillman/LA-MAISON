import type { Express } from "express";
import express from "express";
import path from "path";

export function serveStatic(app: Express) {
  // In production, Vite builds to: dist/public
  const publicDir = path.resolve(process.cwd(), "dist", "public");

  // Serve /assets/* and other static files
  app.use(express.static(publicDir, { index: false }));

  // SPA fallback ONLY for non-file routes
  app.get("*", (req, res) => {
    // If it looks like a file request, do NOT send index.html
    if (req.path.includes(".") || req.path.startsWith("/assets/")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
