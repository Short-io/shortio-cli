import { Command } from "commander";
import { createLinkCountry, createLinkRegion, deleteLinkCountry, deleteLinkRegion } from "@short.io/client-node";
import { initAuth } from "../auth.js";
import { output, handleError } from "../output.js";

export function registerGeoCommands(program: Command): void {
  const geo = program.command("geo").description("Geographic targeting");

  geo
    .command("set")
    .description("Set a country/region redirect for a link")
    .requiredOption("--link-id <id>", "Link ID")
    .requiredOption("--country <CC>", "Country code (e.g. US)")
    .requiredOption("--url <url>", "Redirect URL for this country/region")
    .option("--region <R>", "Region code (e.g. CA for California)")
    .action(async (opts) => {
      initAuth(program.opts());
      if (opts.region) {
        const result = await createLinkRegion({
          path: { linkId: opts.linkId },
          body: {
            country: opts.country,
            region: opts.region,
            originalURL: opts.url,
          },
        });
        if (result.error) handleError(result);
        output(result.data, program.opts().json);
      } else {
        const result = await createLinkCountry({
          path: { linkId: opts.linkId },
          body: {
            country: opts.country,
            originalURL: opts.url,
          },
        });
        if (result.error) handleError(result);
        output(result.data, program.opts().json);
      }
    });

  geo
    .command("delete")
    .description("Remove a country/region redirect from a link")
    .requiredOption("--link-id <id>", "Link ID")
    .requiredOption("--country <CC>", "Country code")
    .option("--region <R>", "Region code")
    .action(async (opts) => {
      initAuth(program.opts());
      if (opts.region) {
        const result = await deleteLinkRegion({
          path: {
            linkId: opts.linkId,
            country: opts.country,
            region: opts.region,
          },
        });
        if (result.error) handleError(result);
        output(result.data, program.opts().json);
      } else {
        const result = await deleteLinkCountry({
          path: {
            linkId: opts.linkId,
            country: opts.country,
          },
        });
        if (result.error) handleError(result);
        output(result.data, program.opts().json);
      }
    });
}
