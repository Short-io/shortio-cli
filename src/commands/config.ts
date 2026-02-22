import { Command } from "commander";
import { readConfig, writeConfig } from "../config.js";

export function registerConfigCommands(program: Command): void {
  const config = program.command("config").description("CLI configuration");

  config
    .command("set-api-key <key>")
    .description("Save API key to ~/.shortio/config.json")
    .action((key) => {
      const existing = readConfig();
      writeConfig({ ...existing, apiKey: key });
      console.log("API key saved.");
    });

  config
    .command("show")
    .description("Show current configuration")
    .action(() => {
      const cfg = readConfig();
      if (cfg.apiKey) {
        const masked = cfg.apiKey.slice(0, 4) + "..." + cfg.apiKey.slice(-4);
        console.log(`apiKey: ${masked}`);
      } else {
        console.log("No API key configured.");
      }
    });
}
