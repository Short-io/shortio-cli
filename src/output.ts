export function output(data: unknown, json: boolean): void {
  if (json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log("No results.");
      return;
    }
    console.table(data);
    return;
  }
  if (typeof data === "object" && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
    }
    return;
  }
  console.log(data);
}

export function handleError(result: { error?: unknown; response?: Response }): never {
  const msg =
    typeof result.error === "object" && result.error !== null
      ? (result.error as Record<string, unknown>).message || (result.error as Record<string, unknown>).error || JSON.stringify(result.error)
      : String(result.error);
  console.error(`Error: ${msg}`);
  process.exit(1);
}
