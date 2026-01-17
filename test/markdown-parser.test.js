'use strict';

const { parseMarkdown, extractHeaders, generateToc } = require('../src/converter/markdown-parser');

describe('Markdown Parser', () => {
  test('parses basic markdown', () => {
    const md = '# Hello World\n\nThis is a paragraph.';
    const html = parseMarkdown(md);
    expect(html).toContain('<h1');
    expect(html).toContain('Hello World');
    expect(html).toContain('<p>');
  });

  test('parses code blocks with syntax highlighting', () => {
    const md = '```javascript\nconst x = 1;\n```';
    const html = parseMarkdown(md);
    expect(html).toContain('md2pdf-code-block');
    expect(html).toContain('const');
  });

  test('parses tables', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const html = parseMarkdown(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<th>');
    expect(html).toContain('<td>');
  });

  test('parses links', () => {
    const md = '[Link](https://example.com)';
    const html = parseMarkdown(md);
    expect(html).toContain('href="https://example.com"');
  });
});

describe('Header Extraction', () => {
  test('extracts headers from markdown', () => {
    const md = '# H1\n## H2\n### H3';
    const headers = extractHeaders(md);
    expect(headers).toHaveLength(3);
    expect(headers[0].level).toBe(1);
    expect(headers[0].text).toBe('H1');
  });

  test('generates header IDs', () => {
    const md = '# Hello World';
    const headers = extractHeaders(md);
    expect(headers[0].id).toBe('hello-world');
  });
});

describe('TOC Generation', () => {
  test('generates TOC when enabled', () => {
    const headers = [
      { level: 1, text: 'Title', id: 'title' },
      { level: 2, text: 'Section', id: 'section' }
    ];
    const config = { toc: { enabled: true, depth: 3, title: 'Contents' } };
    const toc = generateToc(headers, config);
    expect(toc).toContain('md2pdf-toc');
    expect(toc).toContain('Contents');
    expect(toc).toContain('href="#title"');
  });

  test('returns empty string when TOC disabled', () => {
    const headers = [{ level: 1, text: 'Title', id: 'title' }];
    const config = { toc: { enabled: false } };
    const toc = generateToc(headers, config);
    expect(toc).toBe('');
  });

  test('respects depth setting', () => {
    const headers = [
      { level: 1, text: 'H1', id: 'h1' },
      { level: 2, text: 'H2', id: 'h2' },
      { level: 3, text: 'H3', id: 'h3' },
      { level: 4, text: 'H4', id: 'h4' }
    ];
    const config = { toc: { enabled: true, depth: 2 } };
    const toc = generateToc(headers, config);
    expect(toc).toContain('H1');
    expect(toc).toContain('H2');
    expect(toc).not.toContain('H3');
    expect(toc).not.toContain('H4');
  });
});
