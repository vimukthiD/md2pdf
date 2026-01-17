'use strict';

const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

function createMarkdownParser() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="md2pdf-code-block hljs"><code class="language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch (_) {
          // Ignore highlighting errors
        }
      }
      return `<pre class="md2pdf-code-block"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  });

  return md;
}

function parseMarkdown(content) {
  const md = createMarkdownParser();
  return md.render(content);
}

function extractHeaders(content) {
  const headers = [];
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headerRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    headers.push({ level, text, id });
  }

  return headers;
}

function generateToc(headers, config) {
  if (!config.toc?.enabled) {
    return '';
  }

  const depth = config.toc.depth || 3;
  const title = config.toc.title || 'Table of Contents';
  const filteredHeaders = headers.filter(h => h.level <= depth);

  if (filteredHeaders.length === 0) {
    return '';
  }

  let toc = `<div class="md2pdf-toc"><h2 class="md2pdf-toc-title">${title}</h2><ul class="md2pdf-toc-list">`;

  for (const header of filteredHeaders) {
    const indent = (header.level - 1) * 20;
    toc += `<li style="margin-left: ${indent}px;"><a href="#${header.id}">${header.text}</a></li>`;
  }

  toc += '</ul></div>';
  return toc;
}

module.exports = {
  createMarkdownParser,
  parseMarkdown,
  extractHeaders,
  generateToc
};
