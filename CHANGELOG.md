# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
