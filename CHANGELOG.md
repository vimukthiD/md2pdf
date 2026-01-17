# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
