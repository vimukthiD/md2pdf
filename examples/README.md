# Examples

This directory contains example usage of md2pdf.

The bundled example files:

- `chapter1.md`, `chapter2.md`, `chapter3.md` — three short Markdown documents
  used to demonstrate single- and multi-file conversion.
- `single-file-output.pdf` — output of the single-file example below.
- `multi-file-output.pdf` — output of the multi-file example below.

## Basic Example

```bash
md2pdf chapter1.md
# Output: chapter1.pdf
```

Or specify the output path:

```bash
md2pdf chapter1.md -o single-file-output.pdf
```

## Multi-File Example

Merge multiple Markdown files into a single PDF, in the order specified, with
an automatic page break between each file:

```bash
md2pdf chapter1.md chapter2.md chapter3.md -o multi-file-output.pdf
```

Notes:

- `-o`/`--output` is required when passing more than one input file.
- Pass `--no-page-breaks` to concatenate without forcing a new page between files:

  ```bash
  md2pdf chapter1.md chapter2.md chapter3.md --no-page-breaks -o book.pdf
  ```

## Custom Config Example

```bash
md2pdf --init
# Edit md2pdf.config.json
md2pdf chapter1.md
```

## Theme Example

```bash
md2pdf chapter1.md --theme dark
```

## Custom CSS Example

```bash
md2pdf chapter1.md --css custom.css
```

Themes, custom CSS, and config files all apply to multi-file output as well:

```bash
md2pdf chapter1.md chapter2.md chapter3.md --theme professional --css custom.css -o book.pdf
```
