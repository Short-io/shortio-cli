import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export interface CsvOptions {
  delimiter?: string;
  skipLines?: number;
}

export function parseCsv(filePath: string, opts: CsvOptions = {}): string[][] {
  const content = readFileSync(filePath, "utf-8");
  const records: string[][] = parse(content, {
    delimiter: opts.delimiter || ",",
    from_line: (opts.skipLines || 0) + 1,
    relax_column_count: true,
  });
  return records;
}
