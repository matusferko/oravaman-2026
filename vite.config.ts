import type { IncomingMessage } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function readJsonBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}") as Record<string, string>);
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function stravaTokenProxy(): Plugin {
  return {
    name: "strava-token-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const env = loadEnv(server.config.mode, process.cwd(), "");

        if (url.endsWith("/api/strava/verify-pin") && req.method === "POST") {
          const syncPin = env.SYNC_PIN;
          if (!syncPin) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "SYNC_PIN not configured on server" }));
            return;
          }
          try {
            const body = await readJsonBody(req);
            const ok = body.pin === syncPin;
            res.statusCode = ok ? 200 : 401;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(ok ? { ok: true } : { error: "Nesprávny PIN" }));
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid request" }));
          }
          return;
        }

        if (!url.endsWith("/api/strava/token") || req.method !== "POST") {
          next();
          return;
        }

        const clientId = env.VITE_STRAVA_CLIENT_ID || env.STRAVA_CLIENT_ID;
        const clientSecret = env.STRAVA_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Missing STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET in .env.local" }));
          return;
        }

        try {
          const body = await readJsonBody(req);
          const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: body.grant_type,
          });

          if (body.grant_type === "authorization_code") {
            params.set("code", body.code);
            params.set("redirect_uri", body.redirect_uri);
          } else if (body.grant_type === "refresh_token") {
            params.set("refresh_token", body.refresh_token);
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Unsupported grant_type" }));
            return;
          }

          const tokenRes = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          });

          const text = await tokenRes.text();
          res.statusCode = tokenRes.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "Strava proxy error",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  base: "/oravaman-2026/",
  plugins: [react(), stravaTokenProxy()],
});
