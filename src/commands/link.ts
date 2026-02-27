import { Command } from "commander";
import {
  createLink,
  listLinks,
  getLink,
  expandLink,
  updateLink,
  deleteLink,
} from "@short.io/client-node";
import { initAuth } from "../auth.js";
import { output, handleError } from "../output.js";

export function registerLinkCommands(program: Command): void {
  const link = program.command("link").description("Manage short links");

  link
    .command("create")
    .description("Create a new short link")
    .requiredOption("--domain <domain>", "Domain for the short link")
    .requiredOption("--url <url>", "Destination URL")
    .option("--path <path>", "Custom path (slug)")
    .option("--title <title>", "Link title")
    .option("--tags <tags>", "Comma-separated tags")
    .option("--cloaking", "Enable cloaking")
    .option("--expires-at <date>", "Expiration date")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await createLink({
        body: {
          domain: opts.domain,
          originalURL: opts.url,
          path: opts.path,
          title: opts.title,
          tags: opts.tags?.split(","),
          cloaking: opts.cloaking,
          expiresAt: opts.expiresAt,
        },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  link
    .command("list")
    .description("List links for a domain")
    .requiredOption("--domain-id <id>", "Domain ID")
    .option("--limit <n>", "Number of links to return")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await listLinks({
        query: {
          domain_id: Number(opts.domainId),
          limit: opts.limit ? Number(opts.limit) : undefined,
        },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  link
    .command("get")
    .description("Get link details by ID")
    .requiredOption("--id <linkId>", "Link ID")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await getLink({
        path: { linkId: opts.id },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  link
    .command("expand")
    .description("Get link info by domain and path")
    .requiredOption("--domain <domain>", "Domain")
    .requiredOption("--path <path>", "Path (slug)")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await expandLink({
        query: { domain: opts.domain, path: opts.path },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  link
    .command("update")
    .description("Update an existing link")
    .requiredOption("--id <linkId>", "Link ID")
    .option("--url <url>", "New destination URL")
    .option("--title <title>", "New title")
    .option("--path <path>", "New path")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await updateLink({
        path: { linkId: opts.id },
        body: {
          originalURL: opts.url,
          title: opts.title,
          path: opts.path,
        },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  link
    .command("delete")
    .description("Delete a link")
    .requiredOption("--id <linkId>", "Link ID")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await deleteLink({
        path: { link_id: opts.id },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });
}
