import { setApiKey } from "@short.io/client-node";
import { readConfig } from "./config.js";

export function initAuth(opts: { apiKey?: string }): void {
  const key = opts.apiKey || process.env.SHORT_IO_API_KEY || readConfig().apiKey;
  if (!key) {
    console.error(
      "Error: API key required. Use --api-key, SHORT_IO_API_KEY env, or `shortio config set-api-key`."
    );
    process.exit(1);
  }
  setApiKey(key);
}
