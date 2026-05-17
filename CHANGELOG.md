# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-05-17

### Added
- Multi-file conversion: pass multiple Markdown files to merge them into a single
  PDF in the specified order, with an automatic page break between each file
- `--no-page-breaks` flag to disable the automatic page breaks between merged files
- `src/utils/markdown-merger.js` with `mergeMarkdownFiles()` and `getCommonBasePath()`
  helpers, plus a full unit-test suite (`test/markdown-merger.test.js`)

### Changed
- `bin/md2pdf.js` CLI now accepts variadic input arguments (`[inputs...]`)
- `src/converter/pdf-generator.js` accepts either a file path or direct content
  (via the new `options.isContent` / `options.basePath` parameters), so merged
  Markdown can be rendered without writing a temp file
- Updated puppeteer 24.35.0 → 25.0.2 (resolves critical `basic-ftp` path-traversal
  advisory and other transitive vulnerabilities)
- Updated markdown-it 14.1.0 → 14.1.1 (ReDoS fix)
- Updated ajv 8.17.1 → 8.20.0 (ReDoS fix)
- Updated commander 14.0.2 → 14.0.3
- Updated jest 30.2.0 → 30.4.2, prettier 3.5.2 → 3.8.3, eslint 9.39.2 → 9.39.4
- Pinned all dependency versions (no `^`/`~` ranges) for reproducible installs
- Added `overrides` for `fast-uri@3.1.2` and `flatted@3.4.2` to pull in upstream
  security fixes that have not yet propagated through ajv / eslint

### Removed
- **Breaking:** Removed the legacy positional-output form
  (`md2pdf input.md output.pdf`); with variadic input support, a second positional
  argument is now interpreted as another input file. Use `-o`/`--output` instead.
- **Breaking:** Dropped support for Node.js < 22.12 (required by Puppeteer 25).
  Minimum Node version bumped from `>=16.0.0` to `>=22.12.0`.

### Security
- `npm audit`: 0 vulnerabilities (down from 9 — 1 critical, 4 high, 4 moderate)

## [2.0.2] - 2025-01-17

### Changed
- Updated puppeteer from 23.11.1 to 24.35.0 (fixes deprecation warnings)
- Updated commander from 11.1.0 to 14.0.2
- Updated ajv from 8.12.0 to 8.17.1
- Updated highlight.js from 11.9.0 to 11.11.1
- Updated markdown-it from 14.0.0 to 14.1.0
- Updated eslint from 8.57.1 to 9.39.2 (migrated to flat config)
- Updated jest from 29.7.0 to 30.2.0
- Updated prettier from 3.2.0 to 3.5.2

## [2.0.1] - 2025-01-16

### Added
- Configuration file support (JSON)
- Multiple configuration sources (CLI, project, user, defaults)
- Theme support (default, minimal, dark, professional)
- Custom CSS support
- Table of Contents generation
- Variable substitution in headers/footers
- Syntax highlighting for code blocks
- Comprehensive validation and error handling
- CLI options: --init, --validate, --theme, --css, --verbose, --quiet
- Full test suite with Jest
- ESLint and Prettier configuration
- PDF generation with Puppeteer
- Markdown parsing with markdown-it

### Security
- Input validation for file paths
- Secure configuration loading
- No arbitrary code execution
