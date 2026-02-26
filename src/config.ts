import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".shortio");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string;
}

export function readConfig(): Config {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch (error) {
    console.warn(
      `Warning: Failed to read config from ${CONFIG_FILE}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return {};
  }
}

export function writeConfig(config: Config): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}
