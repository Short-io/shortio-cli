import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export interface CsvOptions {
  delimiter?: string;
  skipLines?: number;
}

export function parseCsv(filePath: string, opts: CsvOptions = {}): string[][] {
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to read CSV file at path "${filePath}": ${message}`,
    );
  }
  const records: string[][] = parse(content, {
    delimiter: opts.delimiter || ",",
    from_line: (opts.skipLines || 0) + 1,
    relax_column_count: true,
  });
  return records;
}
