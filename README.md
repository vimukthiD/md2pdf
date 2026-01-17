# md2pdf

A configurable command-line utility that converts Markdown files to professionally formatted PDFs with customizable styling, headers, footers, and themes.

[![npm version](https://badge.fury.io/js/%40vimukthid%2Fmd2pdf.svg)](https://www.npmjs.com/package/@vimukthid/md2pdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Convert Markdown to professionally styled PDFs
- Configurable headers and footers with variable substitution
- Multiple built-in themes (default, minimal, dark, professional)
- Custom CSS support
- Table of Contents generation
- Syntax highlighting for code blocks
- JSON configuration files with schema validation
- Supports all standard Markdown elements

## Installation

```bash
npm install -g @vimukthid/md2pdf
```

Or use locally in your project:

```bash
npm install @vimukthid/md2pdf
```

## Quick Start

```bash
# Convert a Markdown file to PDF
md2pdf document.md

# Specify output file
md2pdf document.md output.pdf

# Use a specific theme
md2pdf document.md --theme dark

# Generate a config file
md2pdf --init
```

## Usage

```bash
md2pdf <input.md> [output.pdf] [options]

Arguments:
  input.md              Path to input Markdown file (required)
  output.pdf            Path to output PDF file (optional)

Options:
  -c, --config <path>   Path to configuration file
  -o, --output <path>   Output PDF path
  --init                Generate default config file (md2pdf.config.json)
  --validate            Validate configuration file without converting
  --no-config           Ignore all configuration files, use defaults only
  --theme <name>        Use a built-in theme (default, minimal, dark, professional)
  --css <path>          Path to custom CSS file
  --verbose             Show detailed conversion process
  --quiet               Suppress all output except errors
  -v, --version         Show version number
  -h, --help            Show help message
```

## Configuration

md2pdf supports JSON configuration files. Configuration is loaded from multiple sources in priority order:

1. Command-line specified config (`--config path/to/config.json`)
2. Project-level config (`./md2pdf.config.json`)
3. User-level config (`~/.md2pdf/config.json`)
4. Built-in defaults

### Generate Config File

```bash
md2pdf --init
```

This creates `md2pdf.config.json` with default settings.

### Configuration Options

```json
{
  "$schema": "https://vimukthid.dev/md2pdf/schema.json",
  "footer": {
    "enabled": true,
    "left": "© {year} - {website} | {email}",
    "right": "Page {page} / {total}",
    "fontSize": "9px",
    "color": "#666666"
  },
  "header": {
    "enabled": false,
    "left": "",
    "center": "",
    "right": ""
  },
  "page": {
    "format": "A4",
    "margin": {
      "top": "2cm",
      "right": "2cm",
      "bottom": "2.5cm",
      "left": "2cm"
    },
    "printBackground": true
  },
  "style": {
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    "fontSize": "16px",
    "lineHeight": "1.6",
    "color": "#333333",
    "h1": {
      "color": "#2c3e50",
      "borderBottom": "3px solid #3498db",
      "fontSize": "32px"
    },
    "h2": {
      "color": "#34495e",
      "borderBottom": "2px solid #95a5a6",
      "fontSize": "24px"
    },
    "code": {
      "backgroundColor": "#f4f4f4",
      "color": "#e74c3c",
      "fontSize": "13px"
    },
    "codeBlock": {
      "backgroundColor": "#f8f8f8",
      "border": "1px solid #ddd",
      "fontSize": "13px"
    },
    "table": {
      "headerBackground": "#3498db",
      "headerColor": "#ffffff",
      "borderColor": "#dddddd"
    }
  },
  "variables": {
    "website": "https://example.com",
    "email": "contact@example.com",
    "author": "Your Name",
    "company": "Company Name",
    "year": "auto"
  },
  "toc": {
    "enabled": false,
    "position": "start",
    "depth": 3,
    "title": "Table of Contents"
  }
}
```

### Variable Substitution

Use these variables in header/footer templates:

| Variable | Description |
|----------|-------------|
| `{year}` | Current year (or value from config) |
| `{date}` | Current date (YYYY-MM-DD) |
| `{time}` | Current time (HH:MM:SS) |
| `{page}` | Current page number |
| `{total}` | Total page count |
| `{filename}` | Input filename without extension |
| `{website}` | Website from variables |
| `{email}` | Email from variables |
| `{author}` | Author from variables |
| `{company}` | Company from variables |

## Themes

md2pdf includes four built-in themes:

- **default** - Clean, modern styling
- **minimal** - Simple, serif-based design
- **dark** - Dark mode with syntax highlighting colors
- **professional** - Business document styling

```bash
md2pdf document.md --theme professional
```

Or in config:

```json
{
  "theme": "dark"
}
```

## Custom CSS

Apply custom CSS to your PDFs:

```bash
md2pdf document.md --css custom.css
```

Or in config:

```json
{
  "style": {
    "customCSS": "body { background: #fafafa; }"
  }
}
```

### Available CSS Classes

```css
.md2pdf-body { }
.md2pdf-h1, .md2pdf-h2, .md2pdf-h3, .md2pdf-h4, .md2pdf-h5, .md2pdf-h6 { }
.md2pdf-p { }
.md2pdf-code { }
.md2pdf-code-block { }
.md2pdf-table { }
.md2pdf-blockquote { }
.md2pdf-link { }
.md2pdf-list { }
.md2pdf-image { }
.md2pdf-toc { }
```

## Programmatic API

```javascript
const { convertMarkdownToPdf, loadConfig, getDefaults } = require('@vimukthid/md2pdf');

// Basic usage
await convertMarkdownToPdf('input.md', 'output.pdf', getDefaults());

// With custom config
const config = await loadConfig('./my-config.json');
await convertMarkdownToPdf('input.md', 'output.pdf', config);
```

## Page Formats

Supported page formats:
- A4 (default)
- Letter
- Legal
- A3
- A5
- Tabloid

## Requirements

- Node.js >= 16.0.0
- Chromium (automatically installed with Puppeteer)

## Troubleshooting

### Puppeteer/Chromium Issues

If you encounter issues with Puppeteer, try:

```bash
# Install Chromium manually
npx puppeteer browsers install chrome
```

### Permission Errors

Ensure you have write permissions to the output directory.

### Large Files

For large documents, the conversion may take longer. Use `--verbose` to see progress.

## License

MIT © Vimukthi Dissanayake

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## Changelog

### 2.0.1
- Added configuration file support
- Added theme support
- Added custom CSS support
- Added Table of Contents generation
- Added variable substitution in headers/footers
- Improved error handling and validation
