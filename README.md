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

## Claude Code Plugin

This project includes a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that lets you manage Short.io links using natural language directly from your terminal.

### Install from marketplace

```bash
# Add the marketplace (one-time)
claude /plugin marketplace add Short-io/shortio-cli

# Install the plugin
claude /plugin install shortio
```

### Install locally

```bash
# Clone and set up the CLI
git clone https://github.com/Short-io/shortio-cli.git
cd shortio-cli
npm install && npm run build && npm link

# Test the plugin locally
claude --plugin-dir .
```

### Setup

Configure your API key (get it from [Short.io dashboard](https://app.short.io/settings/integrations/api-key)):

```bash
shortio config set-api-key YOUR_API_KEY
```

### Usage

The `/shortio` slash command accepts natural language:

```
/shortio list all my domains
/shortio create a link for example.com pointing to https://google.com
/shortio show links for domain 12345
/shortio generate a QR code for link lnk_abc123 and save to qr.png
/shortio set a US redirect for link lnk_abc123 to https://us.example.com
/shortio delete links lnk_abc,lnk_def
```

### Plugin structure

```
.claude-plugin/
  plugin.json            # Plugin manifest
  marketplace.json       # Marketplace metadata
skills/
  shortio/
    SKILL.md             # Skill definition
```

## Development

```bash
npm install
npm run build
node dist/bin.js --help
```

## License

ISC
