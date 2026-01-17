# Product Requirements Document (PRD)
# md2pdf - Configurable Markdown to PDF Converter

**Version**: 1.0.0  
**Author**: Vimukthi Dissanayake  
**Date**: 2025-01-16  
**Status**: Draft

---

## 1. Executive Summary

### 1.1 Product Overview
md2pdf is a command-line utility that converts Markdown files to professionally formatted PDFs. Version 2.0 introduces configuration file support, allowing users to customize footer branding, styling, and output options without modifying the source code.

### 1.2 Goals
- Enable customization through JSON configuration files
- Maintain backward compatibility with v1.0
- Provide sensible defaults for zero-configuration usage
- Support both global and per-project configuration
- Keep the CLI interface simple and intuitive

### 1.3 Target Users
- Technical writers creating documentation
- Developers generating reports and specifications
- Content creators converting notes to PDFs
- Teams needing consistent branded PDFs
- Organizations requiring customized document templates

---

## 2. Product Requirements

### 2.1 Core Functionality

#### 2.1.1 Markdown to PDF Conversion
**Priority**: P0 (Critical)

**Requirements**:
- Convert standard Markdown syntax to PDF
- Support headers (H1-H6)
- Support text formatting (bold, italic, bold-italic)
- Support code blocks (inline and fenced)
- Support lists (ordered and unordered, nested)
- Support tables
- Support links
- Support horizontal rules
- Support blockquotes
- Support images (inline and referenced)

**Acceptance Criteria**:
- All standard Markdown elements render correctly
- Code blocks maintain formatting and indentation
- Tables are properly styled with borders
- Links are clickable in the PDF
- Images are embedded and scaled appropriately

#### 2.1.2 Configuration File Support
**Priority**: P0 (Critical)

**Requirements**:
- Support JSON configuration files
- Load configuration from multiple sources (priority order):
  1. Command-line specified config (`--config path/to/config.json`)
  2. Project-level config (`./md2pdf.config.json`)
  3. User-level config (`~/.md2pdf/config.json`)
  4. Built-in defaults
- Merge configurations (higher priority overrides lower)
- Validate configuration schema
- Provide helpful error messages for invalid configs

**Configuration Schema**:
```json
{
  "footer": {
    "enabled": true,
    "left": "© {year} - {website} | {email}",
    "right": "Page {page} / {total}",
    "fontSize": "9px",
    "color": "#666666",
    "padding": "5px 20px"
  },
  "header": {
    "enabled": false,
    "left": "",
    "center": "",
    "right": "",
    "fontSize": "9px",
    "color": "#666666",
    "padding": "5px 20px"
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
    "website": "https://vimukthid.dev",
    "email": "dissanayake.kasun@gmail.com",
    "author": "Vimukthi Dissanayake",
    "company": "VimukthiD",
    "year": "auto"
  },
  "output": {
    "displayHeaderFooter": true,
    "preferCSSPageSize": false
  }
}
```

**Variable Substitution**:
Support template variables in footer/header text:
- `{year}` - Current year or value from config
- `{website}` - Website URL from variables
- `{email}` - Email from variables
- `{author}` - Author name from variables
- `{company}` - Company name from variables
- `{page}` - Current page number
- `{total}` - Total page count
- `{filename}` - Input filename without extension
- `{date}` - Current date (YYYY-MM-DD)
- `{time}` - Current time (HH:MM:SS)

**Acceptance Criteria**:
- Configuration files are loaded in correct priority order
- Invalid JSON shows clear error message with line number
- Missing optional fields use defaults
- Variables are substituted correctly in footer/header
- Configuration validation catches common errors

#### 2.1.3 Command-Line Interface
**Priority**: P0 (Critical)

**Requirements**:
```bash
md2pdf <input.md> [output.pdf] [options]

Arguments:
  input.md              Path to input Markdown file (required)
  output.pdf            Path to output PDF file (optional)

Options:
  -c, --config <path>   Path to configuration file
  -o, --output <path>   Output PDF path (alternative to positional arg)
  --init                Generate default config file (md2pdf.config.json)
  --validate            Validate configuration file without converting
  --no-config           Ignore all configuration files, use defaults only
  -v, --version         Show version number
  -h, --help            Show help message
  --verbose             Show detailed conversion process
  --quiet               Suppress all output except errors

Examples:
  md2pdf document.md
  md2pdf document.md output.pdf
  md2pdf document.md -c custom-config.json
  md2pdf document.md --no-config
  md2pdf --init
  md2pdf --validate -c config.json
```

**Acceptance Criteria**:
- All options work as documented
- Help message is clear and comprehensive
- Error messages are helpful and actionable
- Exit codes are appropriate (0 = success, 1 = error)

### 2.2 Configuration Management

#### 2.2.1 Config File Generation
**Priority**: P1 (High)

**Requirements**:
- `md2pdf --init` generates default config file
- Generated file includes comments explaining each option
- File is created in current directory as `md2pdf.config.json`
- Prompt before overwriting existing config
- Option to specify output path: `md2pdf --init -o path/to/config.json`

**Generated Config Template**:
```json
{
  "$schema": "https://vimukthid.dev/md2pdf/schema.json",
  "// footer": "Configure footer content and styling",
  "footer": {
    "enabled": true,
    "left": "© {year} - {website} | {email}",
    "right": "Page {page} / {total}",
    "fontSize": "9px",
    "color": "#666666"
  },
  "// variables": "Define variables for use in footer/header templates",
  "variables": {
    "website": "https://example.com",
    "email": "contact@example.com",
    "author": "Your Name"
  },
  "// page": "Page format and margins",
  "page": {
    "format": "A4",
    "margin": {
      "top": "2cm",
      "right": "2cm",
      "bottom": "2.5cm",
      "left": "2cm"
    }
  }
}
```

**Acceptance Criteria**:
- Generated config is valid JSON
- Comments are helpful and clear
- File is properly formatted with indentation
- Overwrites only with user confirmation

#### 2.2.2 Config Validation
**Priority**: P1 (High)

**Requirements**:
- Validate JSON syntax
- Validate against schema
- Check for unknown properties (warn, don't error)
- Validate color formats (hex, rgb, rgba, named)
- Validate page formats (A4, Letter, Legal, etc.)
- Validate margin units (cm, mm, in, px)
- Validate font sizes (px, pt, em, rem)

**Validation Messages**:
```
✓ Configuration is valid
✗ Invalid JSON syntax at line 15: Unexpected token
✗ Invalid color format: "blue123" (expected hex, rgb, or named color)
⚠ Unknown property "footerText" (did you mean "footer.left"?)
✗ Invalid page format: "A5" (supported: A4, Letter, Legal, A3, A5, Tabloid)
```

**Acceptance Criteria**:
- All validation errors are caught before conversion
- Error messages include line numbers when possible
- Suggestions provided for common mistakes
- Warnings don't prevent conversion

### 2.3 Styling and Customization

#### 2.3.1 Custom CSS Support
**Priority**: P2 (Medium)

**Requirements**:
- Support custom CSS file: `--css path/to/custom.css`
- Support inline CSS in config: `style.customCSS`
- Custom CSS overrides default styles
- Provide CSS class names for all elements

**CSS Classes**:
```css
.md2pdf-body { }
.md2pdf-h1, .md2pdf-h2, .md2pdf-h3, .md2pdf-h4, .md2pdf-h5, .md2pdf-h6 { }
.md2pdf-p { }
.md2pdf-code { }
.md2pdf-code-block { }
.md2pdf-table { }
.md2pdf-table-header { }
.md2pdf-list { }
.md2pdf-blockquote { }
.md2pdf-link { }
.md2pdf-image { }
```

**Acceptance Criteria**:
- Custom CSS is applied correctly
- CSS doesn't break PDF generation
- Invalid CSS shows warning but continues

#### 2.3.2 Theme Support
**Priority**: P2 (Medium)

**Requirements**:
- Built-in themes: `default`, `minimal`, `dark`, `professional`
- Specify theme in config: `"theme": "dark"`
- Specify theme via CLI: `--theme dark`
- Themes are complete style presets
- Users can create custom themes

**Theme Structure**:
```json
{
  "theme": "dark",
  "themes": {
    "dark": {
      "style": {
        "color": "#e0e0e0",
        "backgroundColor": "#1e1e1e",
        "h1": { "color": "#61dafb" },
        "code": { "backgroundColor": "#2d2d2d" }
      }
    }
  }
}
```

**Acceptance Criteria**:
- All built-in themes work correctly
- Theme selection via CLI overrides config
- Custom themes can be defined in config

### 2.4 Advanced Features

#### 2.4.1 Batch Conversion
**Priority**: P2 (Medium)

**Requirements**:
- Convert multiple files: `md2pdf *.md`
- Convert directory: `md2pdf --dir ./docs`
- Recursive conversion: `md2pdf --dir ./docs --recursive`
- Output directory: `md2pdf *.md --output-dir ./pdfs`
- Preserve directory structure in output

**Acceptance Criteria**:
- All matching files are converted
- Errors in one file don't stop batch
- Progress indicator shows current file
- Summary shows success/failure count

#### 2.4.2 Watch Mode
**Priority**: P3 (Low)

**Requirements**:
- Watch file for changes: `md2pdf document.md --watch`
- Auto-regenerate on save
- Debounce rapid changes (500ms)
- Show notification on completion

**Acceptance Criteria**:
- PDF updates within 1 second of save
- No duplicate conversions
- Can be stopped with Ctrl+C

#### 2.4.3 Table of Contents
**Priority**: P2 (Medium)

**Requirements**:
- Generate TOC from headers: `"toc": { "enabled": true }`
- TOC placement: `"position": "start"` or `"end"`
- TOC depth: `"depth": 3` (include H1-H3)
- TOC title: `"title": "Table of Contents"`
- Clickable links to sections

**Acceptance Criteria**:
- TOC includes all headers up to specified depth
- Links navigate to correct sections
- TOC is styled consistently

### 2.5 Error Handling

#### 2.5.1 Input Validation
**Priority**: P0 (Critical)

**Requirements**:
- Check if input file exists
- Check if input file is readable
- Check if input file is valid Markdown
- Check if output directory exists
- Check if output file is writable
- Check for sufficient disk space

**Error Messages**:
```
✗ Input file not found: document.md
✗ Cannot read file: document.md (Permission denied)
✗ Output directory does not exist: /nonexistent/path
✗ Cannot write to output file: output.pdf (Permission denied)
✗ Insufficient disk space (required: 5MB, available: 2MB)
```

**Acceptance Criteria**:
- All errors are caught before conversion starts
- Error messages are clear and actionable
- Exit code is 1 for all errors

#### 2.5.2 Conversion Errors
**Priority**: P0 (Critical)

**Requirements**:
- Handle Puppeteer launch failures
- Handle page rendering errors
- Handle PDF generation errors
- Provide fallback for missing fonts
- Handle large files gracefully

**Error Messages**:
```
✗ Failed to launch browser (Chromium not found)
✗ Failed to render page (Out of memory)
✗ Failed to generate PDF (Disk full)
⚠ Font not found: "CustomFont", using fallback
⚠ Large file detected (10MB), this may take a while...
```

**Acceptance Criteria**:
- Errors don't crash the process
- Partial output is cleaned up on error
- Error messages suggest solutions

### 2.6 Performance

#### 2.6.1 Conversion Speed
**Priority**: P1 (High)

**Requirements**:
- Convert typical document (10 pages) in < 3 seconds
- Convert large document (100 pages) in < 15 seconds
- Batch conversion processes files in parallel (max 4 concurrent)
- Show progress indicator for long operations

**Acceptance Criteria**:
- Performance meets targets on standard hardware
- Memory usage stays under 500MB per conversion
- CPU usage is reasonable (< 80% per core)

#### 2.6.2 Caching
**Priority**: P3 (Low)

**Requirements**:
- Cache parsed Markdown (optional)
- Cache rendered HTML (optional)
- Invalidate cache on file change
- Clear cache command: `md2pdf --clear-cache`

**Acceptance Criteria**:
- Cached conversions are 2x faster
- Cache doesn't grow unbounded
- Cache invalidation works correctly

### 2.7 Documentation

#### 2.7.1 User Documentation
**Priority**: P1 (High)

**Requirements**:
- README.md with quick start
- INSTALL.md with installation instructions
- CONFIG.md with configuration reference
- EXAMPLES.md with common use cases
- TROUBLESHOOTING.md with common issues

**Acceptance Criteria**:
- Documentation is clear and comprehensive
- Examples are tested and working
- Troubleshooting covers common issues

#### 2.7.2 API Documentation
**Priority**: P2 (Medium)

**Requirements**:
- JSDoc comments for all functions
- Type definitions (TypeScript .d.ts)
- API usage examples
- Configuration schema documentation

**Acceptance Criteria**:
- All public APIs are documented
- Examples are runnable
- Types are accurate

---

## 3. Technical Specifications

### 3.1 Technology Stack

**Core**:
- Node.js >= 16.0.0
- Puppeteer ^23.0.0 (headless Chrome)

**Optional Dependencies**:
- markdown-it (better Markdown parsing)
- highlight.js (syntax highlighting)
- ajv (JSON schema validation)

**Development**:
- ESLint (code linting)
- Prettier (code formatting)
- Jest (testing)

### 3.2 Architecture

#### 3.2.1 Module Structure
```
src/
├── index.js                 # CLI entry point
├── cli.js                   # Command-line argument parsing
├── config/
│   ├── loader.js           # Configuration loading and merging
│   ├── validator.js        # Configuration validation
│   ├── schema.json         # JSON schema for config
│   └── defaults.js         # Default configuration
├── converter/
│   ├── markdown-parser.js  # Markdown to HTML conversion
│   ├── html-generator.js   # HTML template generation
│   ├── pdf-generator.js    # PDF generation via Puppeteer
│   └── style-builder.js    # CSS generation from config
├── utils/
│   ├── file.js             # File operations
│   ├── logger.js           # Logging utilities
│   ├── variables.js        # Variable substitution
│   └── validation.js       # Input validation
└── themes/
    ├── default.json
    ├── minimal.json
    ├── dark.json
    └── professional.json
```

#### 3.2.2 Data Flow
```
1. CLI Input → Argument Parser
2. Load Configuration (merge from multiple sources)
3. Validate Configuration
4. Read Markdown File
5. Parse Markdown → HTML
6. Apply Styling (from config/theme)
7. Substitute Variables (footer/header)
8. Generate HTML Template
9. Launch Puppeteer
10. Render HTML → PDF
11. Save PDF File
12. Cleanup & Exit
```

### 3.3 Configuration Loading Priority

```
1. Command-line flags (highest priority)
   --config, --theme, --no-config, etc.

2. Command-line specified config file
   md2pdf input.md --config custom.json

3. Project-level config
   ./md2pdf.config.json

4. User-level config
   ~/.md2pdf/config.json

5. Built-in defaults (lowest priority)
   src/config/defaults.js
```

### 3.4 File Structure

#### 3.4.1 Package Structure
```
md2pdf/
├── bin/
│   └── md2pdf              # CLI executable
├── src/
│   └── [modules]           # Source code
├── themes/
│   └── [theme files]       # Built-in themes
├── test/
│   └── [test files]        # Unit and integration tests
├── examples/
│   ├── basic/
│   ├── custom-config/
│   └── themes/
├── docs/
│   ├── README.md
│   ├── CONFIG.md
│   └── EXAMPLES.md
├── package.json
├── LICENSE
└── .gitignore
```

### 3.5 Configuration Schema

**JSON Schema** (`src/config/schema.json`):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "footer": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "left": { "type": "string" },
        "right": { "type": "string" },
        "fontSize": { "type": "string", "pattern": "^\\d+(px|pt|em|rem)$" },
        "color": { "type": "string" }
      }
    },
    "header": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "left": { "type": "string" },
        "center": { "type": "string" },
        "right": { "type": "string" }
      }
    },
    "page": {
      "type": "object",
      "properties": {
        "format": {
          "type": "string",
          "enum": ["A4", "Letter", "Legal", "A3", "A5", "Tabloid"]
        },
        "margin": {
          "type": "object",
          "properties": {
            "top": { "type": "string" },
            "right": { "type": "string" },
            "bottom": { "type": "string" },
            "left": { "type": "string" }
          }
        }
      }
    },
    "variables": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "theme": {
      "type": "string"
    }
  }
}
```

---

## 4. User Stories

### 4.1 Basic Usage

**Story 1**: As a user, I want to convert a Markdown file to PDF with default settings
```bash
md2pdf document.md
```
**Expected**: PDF created with default styling and footer

**Story 2**: As a user, I want to customize the footer with my branding
```bash
# Create config
md2pdf --init

# Edit md2pdf.config.json
{
  "variables": {
    "website": "https://mysite.com",
    "email": "me@mysite.com"
  }
}

# Convert
md2pdf document.md
```
**Expected**: PDF with custom footer branding

### 4.2 Advanced Usage

**Story 3**: As a developer, I want to use different configs for different projects
```bash
# Project A
cd project-a
md2pdf --init
# Edit config for Project A branding
md2pdf docs.md

# Project B
cd project-b
md2pdf --init
# Edit config for Project B branding
md2pdf docs.md
```
**Expected**: Each project uses its own config

**Story 4**: As a team lead, I want to enforce consistent styling across team
```bash
# Create team config
cat > ~/.md2pdf/config.json << EOF
{
  "variables": {
    "company": "Acme Corp",
    "website": "https://acme.com"
  },
  "style": {
    "h1": { "color": "#ff0000" }
  }
}
EOF

# Team members convert docs
md2pdf report.md  # Uses team config
```
**Expected**: All team PDFs have consistent branding

**Story 5**: As a writer, I want to use a dark theme for my documents
```bash
md2pdf document.md --theme dark
```
**Expected**: PDF with dark theme styling

### 4.3 Batch Operations

**Story 6**: As a documentation maintainer, I want to convert all docs at once
```bash
md2pdf --dir ./docs --output-dir ./pdfs --recursive
```
**Expected**: All Markdown files converted to PDFs

**Story 7**: As a developer, I want to auto-regenerate PDF when I save
```bash
md2pdf document.md --watch
```
**Expected**: PDF updates automatically on file save

---

## 5. Testing Requirements

### 5.1 Unit Tests

**Coverage Target**: 80%

**Test Cases**:
- Configuration loading and merging
- Configuration validation
- Variable substitution
- Markdown parsing
- HTML generation
- Style building
- File operations
- Error handling

### 5.2 Integration Tests

**Test Cases**:
- End-to-end conversion with default config
- End-to-end conversion with custom config
- Batch conversion
- Config file generation
- Config validation
- Theme application
- Error scenarios

### 5.3 Manual Testing

**Test Scenarios**:
- Install on macOS, Linux, Windows
- Convert various Markdown files
- Test all CLI options
- Test configuration priority
- Test error messages
- Test performance with large files

---

## 6. Success Metrics

### 6.1 Functional Metrics
- ✅ All P0 requirements implemented
- ✅ 80% test coverage
- ✅ Zero critical bugs
- ✅ Documentation complete

### 6.2 Performance Metrics
- ✅ 10-page document converts in < 3 seconds
- ✅ Memory usage < 500MB
- ✅ Package size < 50MB (excluding Chromium)

### 6.3 User Metrics
- ✅ Installation success rate > 95%
- ✅ Configuration errors < 5% of users
- ✅ User satisfaction > 4/5

---

## 7. Release Plan

### 7.1 Phase 1: Core Features (v1.0.0)
**Timeline**: 2 weeks

**Features**:
- Configuration file support
- Variable substitution
- Config validation
- Config generation (`--init`)
- Backward compatibility with v1.0

**Deliverables**:
- Working npm package
- Basic documentation
- Unit tests

### 7.2 Phase 2: Advanced Features (v2.1.0)
**Timeline**: 2 weeks

**Features**:
- Theme support
- Custom CSS
- Batch conversion
- Table of contents

**Deliverables**:
- Enhanced package
- Complete documentation
- Integration tests

### 7.3 Phase 3: Polish (v2.2.0)
**Timeline**: 1 week

**Features**:
- Watch mode
- Performance optimizations
- Additional themes
- Improved error messages

**Deliverables**:
- Production-ready package
- Comprehensive documentation
- Full test suite

---

## 8. Dependencies and Constraints

### 8.1 Dependencies
- Node.js >= 16.0.0 (required)
- Puppeteer (bundled)
- npm or yarn (for installation)

### 8.2 Constraints
- Must maintain backward compatibility with v1.0
- Must work offline (after initial install)
- Must not require external services
- Package size should be reasonable (< 50MB excluding Chromium)

### 8.3 Assumptions
- Users have basic command-line knowledge
- Users can edit JSON files
- Users have sufficient disk space for Chromium (~300MB)

---

## 9. Open Questions

1. Should we support YAML config files in addition to JSON?
2. Should we support Markdown extensions (GFM, tables, etc.)?
3. Should we provide a GUI for config editing?
4. Should we support PDF encryption/password protection?
5. Should we support PDF metadata (author, title, keywords)?
6. Should we support multiple output formats (HTML, DOCX)?
7. Should we provide a web service version?

---

## 10. Appendix

### 10.1 Example Configurations

**Minimal Config**:
```json
{
  "variables": {
    "website": "https://example.com",
    "email": "contact@example.com"
  }
}
```

**Complete Config**:
```json
{
  "footer": {
    "enabled": true,
    "left": "© {year} {company} | {website}",
    "right": "Page {page} / {total}",
    "fontSize": "9px",
    "color": "#666666"
  },
  "header": {
    "enabled": true,
    "center": "{filename}",
    "fontSize": "9px",
    "color": "#999999"
  },
  "page": {
    "format": "Letter",
    "margin": {
      "top": "1in",
      "right": "1in",
      "bottom": "1in",
      "left": "1in"
    }
  },
  "style": {
    "fontFamily": "Georgia, serif",
    "fontSize": "14px",
    "lineHeight": "1.8",
    "h1": {
      "color": "#000000",
      "fontSize": "28px"
    }
  },
  "variables": {
    "company": "Acme Corp",
    "website": "https://acme.com",
    "email": "info@acme.com",
    "author": "John Doe"
  },
  "toc": {
    "enabled": true,
    "position": "start",
    "depth": 3,
    "title": "Contents"
  }
}
```

### 10.2 CLI Examples

```bash
# Basic conversion
md2pdf document.md

# With custom config
md2pdf document.md -c company-config.json

# Generate config
md2pdf --init

# Validate config
md2pdf --validate -c config.json

# Use theme
md2pdf document.md --theme dark

# Batch conversion
md2pdf *.md --output-dir ./pdfs

# Watch mode
md2pdf document.md --watch

# Verbose output
md2pdf document.md --verbose

# No config (defaults only)
md2pdf document.md --no-config
```

### 10.3 Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{year}` | Current year | 2025 |
| `{date}` | Current date | 2025-01-16 |
| `{time}` | Current time | 14:30:00 |
| `{page}` | Current page | 1 |
| `{total}` | Total pages | 10 |
| `{filename}` | Input filename | document |
| `{website}` | From variables | https://example.com |
| `{email}` | From variables | contact@example.com |
| `{author}` | From variables | John Doe |
| `{company}` | From variables | Acme Corp |

### 10.4 Supported Page Formats

- **A4**: 210mm × 297mm
- **Letter**: 8.5in × 11in
- **Legal**: 8.5in × 14in
- **A3**: 297mm × 420mm
- **A5**: 148mm × 210mm
- **Tabloid**: 11in × 17in

### 10.5 Color Format Examples

```json
{
  "color": "#ff0000",           // Hex
  "color": "#f00",              // Short hex
  "color": "rgb(255, 0, 0)",    // RGB
  "color": "rgba(255, 0, 0, 0.5)", // RGBA
  "color": "red",               // Named color
  "color": "hsl(0, 100%, 50%)"  // HSL
}
```

---

## 11. Implementation Guidelines for AI Agent

### 11.1 Project Setup

1. **Initialize npm package**:
   ```bash
   npm init -y
   npm install puppeteer
   npm install --save-dev eslint prettier jest
   ```

2. **Create directory structure** as specified in section 3.4.1

3. **Set up package.json**:
   - Add bin entry pointing to `bin/md2pdf`
   - Add scripts for test, lint, format
   - Set type to "module" for ES modules

### 11.2 Implementation Order

**Phase 1** (Core):
1. Create default configuration (`src/config/defaults.js`)
2. Implement config loader (`src/config/loader.js`)
3. Implement config validator (`src/config/validator.js`)
4. Create CLI parser (`src/cli.js`)
5. Implement variable substitution (`src/utils/variables.js`)
6. Implement Markdown parser (`src/converter/markdown-parser.js`)
7. Implement HTML generator (`src/converter/html-generator.js`)
8. Implement style builder (`src/converter/style-builder.js`)
9. Implement PDF generator (`src/converter/pdf-generator.js`)
10. Create main entry point (`src/index.js`)
11. Create CLI executable (`bin/md2pdf`)

**Phase 2** (Features):
1. Implement theme support
2. Implement custom CSS support
3. Implement batch conversion
4. Implement TOC generation
5. Add built-in themes

**Phase 3** (Polish):
1. Add watch mode
2. Optimize performance
3. Improve error messages
4. Add progress indicators
5. Write comprehensive tests

### 11.3 Code Style Guidelines

- Use ES6+ features (async/await, destructuring, etc.)
- Use meaningful variable and function names
- Add JSDoc comments for all functions
- Handle errors gracefully with try/catch
- Validate inputs before processing
- Use const by default, let when needed, avoid var
- Keep functions small and focused (< 50 lines)
- Use early returns to reduce nesting

### 11.4 Testing Guidelines

- Write unit tests for all utility functions
- Write integration tests for main workflows
- Test error scenarios
- Test edge cases (empty files, large files, invalid input)
- Mock Puppeteer in tests to avoid launching browser
- Use fixtures for test Markdown files

### 11.5 Documentation Guidelines

- Write clear README with quick start
- Document all configuration options
- Provide examples for common use cases
- Include troubleshooting section
- Add inline code comments for complex logic
- Keep documentation in sync with code

---

**End of PRD**

---

**Approval**:
- [ ] Product Manager
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] QA Lead

**Version History**:
- v1.0 (2025-01-16): Initial draft
