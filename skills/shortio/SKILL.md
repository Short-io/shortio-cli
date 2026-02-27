---
name: shortio
description: Manage Short.io links, domains, QR codes, and geo targeting using the shortio CLI. Use when the user wants to create/list/update/delete short links, manage domains, generate QR codes, set up geographic redirects, or perform bulk operations.
argument-hint: "[command description or natural language request]"
allowed-tools: Bash(shortio *), Bash(node dist/bin.js *), Read
---

# Short.io CLI Skill

Execute Short.io CLI commands based on user requests. Translate natural language into the correct `shortio` command and run it.

## Authentication

Before running any command (except `config`), ensure the user has an API key configured:
- Check with `shortio config show`
- If not set, ask the user for their API key and run `shortio config set-api-key <key>`

API key sources (priority order): `--api-key` flag > `SHORT_IO_API_KEY` env > `~/.shortio/config.json`

## Available Commands

### Links

```bash
# Create a short link
shortio link create --domain <domain> --url <url> [--path <path>] [--title <title>] [--tags <t1,t2>] [--cloaking] [--expires-at <date>]

# List links for a domain
shortio link list --domain-id <id> [--limit <n>]

# Get link details
shortio link get --id <linkId>

# Expand a link by domain and path
shortio link expand --domain <domain> --path <path>

# Update a link
shortio link update --id <linkId> [--url <url>] [--title <title>] [--path <path>]

# Delete a link
shortio link delete --id <linkId>
```

### Domains

```bash
# List all domains
shortio domain list

# Get domain details
shortio domain get --id <domainId>
```

### Bulk Operations

```bash
# Create links from CSV
shortio bulk create --domain <domain> --file <csv> --url-column <n> [--path-column <n>] [--title-column <n>] [--delimiter <char>] [--skip-lines <n>] [--allow-duplicates] [--cloaking]

# Delete multiple links
shortio bulk delete --ids <id1,id2,...>

# Archive multiple links
shortio bulk archive --ids <id1,id2,...>
```

### QR Codes

```bash
# Generate QR code
shortio qr generate --link-id <id> [--output <file>]

# Bulk QR codes
shortio qr bulk --link-ids <id1,id2,...>
```

### Geographic Targeting

```bash
# Set country/region redirect
shortio geo set --link-id <id> --country <CC> --url <url> [--region <R>]

# Remove country/region redirect
shortio geo delete --link-id <id> --country <CC> [--region <R>]
```

### Configuration

```bash
shortio config set-api-key <key>
shortio config show
```

## Global Options

- `--api-key <key>` — override API key for a single command
- `--json` — output as JSON (useful for piping/scripting)

## Workflow

1. Parse `$ARGUMENTS` to understand what the user wants to do
2. If the request is ambiguous, ask for clarification (e.g. which domain, which link ID)
3. If the user needs to discover IDs first, run `shortio domain list` or `shortio link list` to find them
4. Construct and execute the appropriate command
5. If `--json` output would be more useful (e.g. for further processing), add the flag
6. Present the results clearly to the user
