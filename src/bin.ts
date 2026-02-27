#!/usr/bin/env node

import { Command } from "commander";
import { registerLinkCommands } from "./commands/link.js";
import { registerDomainCommands } from "./commands/domain.js";
import { registerBulkCommands } from "./commands/bulk.js";
import { registerQrCommands } from "./commands/qr.js";
import { registerGeoCommands } from "./commands/geo.js";
import { registerConfigCommands } from "./commands/config.js";

const program = new Command();

program
  .name("shortio")
  .description("Short.io CLI — manage links, domains, QR codes, and more")
  .version("1.0.0")
  .option("--api-key <key>", "Short.io API key")
  .option("--json", "Output as JSON", false);

registerLinkCommands(program);
registerDomainCommands(program);
registerBulkCommands(program);
registerQrCommands(program);
registerGeoCommands(program);
registerConfigCommands(program);

program.parse();
