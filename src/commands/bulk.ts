import { Command } from "commander";
import {
  createLinksBulk,
  deleteLinksBulk,
  archiveLinksBulk,
} from "@short.io/client-node";
import { initAuth } from "../auth.js";
import { output, handleError } from "../output.js";
import { parseCsv } from "../csv.js";

export function registerBulkCommands(program: Command): void {
  const bulk = program.command("bulk").description("Bulk link operations");

  bulk
    .command("create")
    .description("Create links from a CSV file")
    .requiredOption("--domain <domain>", "Domain for the links")
    .requiredOption("--file <csv>", "CSV file path")
    .requiredOption("--url-column <n>", "Column index for URLs (0-based)")
    .option("--path-column <n>", "Column index for paths")
    .option("--title-column <n>", "Column index for titles")
    .option("--delimiter <c>", "CSV delimiter", ",")
    .option("--skip-lines <n>", "Lines to skip (e.g. header)", "0")
    .option("--allow-duplicates", "Allow duplicate URLs")
    .option("--cloaking", "Enable cloaking on all links")
    .action(async (opts) => {
      initAuth(program.opts());
      const rows = parseCsv(opts.file, {
        delimiter: opts.delimiter,
        skipLines: Number(opts.skipLines),
      });

      const links = rows.map((row) => ({
        originalURL: row[Number(opts.urlColumn)],
        path: opts.pathColumn != null ? row[Number(opts.pathColumn)] : undefined,
        title: opts.titleColumn != null ? row[Number(opts.titleColumn)] : undefined,
        cloaking: opts.cloaking || undefined,
      }));

      const CHUNK_SIZE = 1000;
      const allResults: unknown[] = [];

      for (let i = 0; i < links.length; i += CHUNK_SIZE) {
        const chunk = links.slice(i, i + CHUNK_SIZE);
        const result = await createLinksBulk({
          body: {
            domain: opts.domain,
            allowDuplicates: opts.allowDuplicates,
            links: chunk.map((l) => ({ ...l, originalURL: l.originalURL })),
          },
        });
        if (result.error) handleError(result);
        if (Array.isArray(result.data)) {
          allResults.push(...result.data);
        } else {
          allResults.push(result.data);
        }
        if (i + CHUNK_SIZE < links.length) {
          console.error(
            `Processed ${Math.min(i + CHUNK_SIZE, links.length)}/${links.length} links...`
          );
        }
      }

      output(allResults, program.opts().json);
    });

  bulk
    .command("delete")
    .description("Delete multiple links by ID")
    .requiredOption("--ids <ids>", "Comma-separated link IDs")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await deleteLinksBulk({
        body: { link_ids: opts.ids.split(",") },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });

  bulk
    .command("archive")
    .description("Archive multiple links by ID")
    .requiredOption("--ids <ids>", "Comma-separated link IDs")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await archiveLinksBulk({
        body: { link_ids: opts.ids.split(",") },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });
}
