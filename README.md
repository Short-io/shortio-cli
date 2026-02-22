# @short.io/cli

Official CLI for [Short.io](https://short.io) URL shortening and link management.

## Installation

```bash
npm install -g @short.io/cli
```

Requires Node.js >= 20.

## Authentication

Set your API key (get it from [Short.io dashboard](https://app.short.io/settings/integrations/api-key)):

```bash
# Save to ~/.shortio/config.json (persistent)
shortio config set-api-key YOUR_API_KEY

# Or use an environment variable
export SHORT_IO_API_KEY="YOUR_API_KEY"

# Or pass per-command
shortio --api-key YOUR_API_KEY domain list
```

Priority: `--api-key` flag > `SHORT_IO_API_KEY` env > config file.

## Usage

### Links

```bash
# Create a short link
shortio link create --domain example.com --url https://example.com/long-page

# Create with custom path, title, and tags
shortio link create --domain example.com --url https://example.com \
  --path my-link --title "My Link" --tags marketing,social

# List links for a domain
shortio link list --domain-id 12345

# Get link details
shortio link get --id lnk_abc123

# Expand a link by domain and path
shortio link expand --domain example.com --path my-link

# Update a link
shortio link update --id lnk_abc123 --url https://new-url.com --title "New Title"

# Delete a link
shortio link delete --id lnk_abc123
```

### Domains

```bash
# List all domains
shortio domain list

# Get domain details
shortio domain get --id 12345
```

### Bulk Operations

```bash
# Create links from a CSV file
shortio bulk create --domain example.com --file links.csv --url-column 0

# With custom columns and options
shortio bulk create --domain example.com --file links.csv \
  --url-column 0 --path-column 1 --title-column 2 \
  --delimiter ";" --skip-lines 1 --allow-duplicates

# Delete multiple links
shortio bulk delete --ids lnk_abc,lnk_def,lnk_ghi

# Archive multiple links
shortio bulk archive --ids lnk_abc,lnk_def
```

### QR Codes

```bash
# Generate a QR code
shortio qr generate --link-id lnk_abc123

# Save QR code to file
shortio qr generate --link-id lnk_abc123 --output qr.png

# Bulk QR code generation
shortio qr bulk --link-ids lnk_abc,lnk_def,lnk_ghi
```

### Geographic Targeting

```bash
# Set a country redirect
shortio geo set --link-id lnk_abc123 --country US --url https://us.example.com

# Set a region redirect
shortio geo set --link-id lnk_abc123 --country US --region CA --url https://ca.example.com

# Remove a country redirect
shortio geo delete --link-id lnk_abc123 --country US

# Remove a region redirect
shortio geo delete --link-id lnk_abc123 --country US --region CA
```

### Configuration

```bash
# Save API key
shortio config set-api-key YOUR_API_KEY

# Show current config (key is masked)
shortio config show
```

## Global Options

| Option | Description |
|--------|-------------|
| `--api-key <key>` | Short.io API key |
| `--json` | Output as JSON |
| `-V, --version` | Show version |
| `-h, --help` | Show help |

## Development

```bash
npm install
npm run build
node dist/bin.js --help
```

## License

ISC
