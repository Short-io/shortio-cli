import { Command } from "commander";
import { listDomains, getDomain } from "@short.io/client-node";
import { initAuth } from "../auth.js";
import { output, handleError } from "../output.js";

export function registerDomainCommands(program: Command): void {
  const domain = program.command("domain").description("Manage domains");

  domain
    .command("list")
    .description("List all domains")
    .action(async () => {
      initAuth(program.opts());
      const result = await listDomains();
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  domain
    .command("get")
    .description("Get domain details")
    .requiredOption("--id <domainId>", "Domain ID")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await getDomain({
        path: { domainId: Number(opts.id) },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });
}
