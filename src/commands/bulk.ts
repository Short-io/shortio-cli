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

      const urlColumnIndex = Number(opts.urlColumn);
      if (!Number.isInteger(urlColumnIndex) || urlColumnIndex < 0) {
        throw new Error(`Invalid --url-column value: ${opts.urlColumn}`);
      }

      const pathColumnIndex =
        opts.pathColumn != null ? Number(opts.pathColumn) : undefined;
      if (
        pathColumnIndex != null &&
        (!Number.isInteger(pathColumnIndex) || pathColumnIndex < 0)
      ) {
        throw new Error(`Invalid --path-column value: ${opts.pathColumn}`);
      }

      const titleColumnIndex =
        opts.titleColumn != null ? Number(opts.titleColumn) : undefined;
      if (
        titleColumnIndex != null &&
        (!Number.isInteger(titleColumnIndex) || titleColumnIndex < 0)
      ) {
        throw new Error(`Invalid --title-column value: ${opts.titleColumn}`);
      }

      const maxRequiredIndex = Math.max(
        urlColumnIndex,
        pathColumnIndex != null ? pathColumnIndex : -1,
        titleColumnIndex != null ? titleColumnIndex : -1,
      );

      rows.forEach((row, rowIndex) => {
        if (row.length <= maxRequiredIndex) {
          throw new Error(
            `Row ${rowIndex} in CSV does not contain column index ${maxRequiredIndex} ` +
              `(found ${row.length} columns).`,
          );
        }
      });

      const links = rows.map((row) => ({
        originalURL: row[urlColumnIndex],
        path: pathColumnIndex != null ? row[pathColumnIndex] : undefined,
        title: titleColumnIndex != null ? row[titleColumnIndex] : undefined,
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
            `Processed ${Math.min(i + CHUNK_SIZE, links.length)}/${links.length} links...`,
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
