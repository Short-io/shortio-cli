import { Command } from "commander";
import { writeFileSync } from "node:fs";
import { generateQrCode, generateQrCodesBulk } from "@short.io/client-node";
import { initAuth } from "../auth.js";
import { output, handleError } from "../output.js";

export function registerQrCommands(program: Command): void {
  const qr = program.command("qr").description("QR code operations");

  qr.command("generate")
    .description("Generate a QR code for a link")
    .requiredOption("--link-id <id>", "Link ID")
    .option("--output <file>", "Output file path")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await generateQrCode({
        path: { linkIdString: opts.linkId },
        body: { useDomainSettings: true },
      });
      if (result.error) handleError(result);

      if (opts.output && result.data) {
        const data = result.data as ArrayBuffer | string;
        if (data instanceof ArrayBuffer) {
          writeFileSync(opts.output, Buffer.from(data));
        } else {
          writeFileSync(opts.output, String(data));
        }
        console.log(`QR code saved to ${opts.output}`);
      } else {
        output(result.data, program.opts().json);
      }
    });

  qr.command("bulk")
    .description("Generate QR codes for multiple links")
    .requiredOption("--link-ids <ids>", "Comma-separated link IDs")
    .action(async (opts) => {
      initAuth(program.opts());
      const result = await generateQrCodesBulk({
        body: {
          linkIds: opts.linkIds.split(","),
          type: "png",
          useDomainSettings: true,
        },
      });
      if (result.error) handleError(result);
      output(result.data, program.opts().json);
    });
}
