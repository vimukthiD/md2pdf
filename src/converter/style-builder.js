'use strict';

function buildStyles(config) {
  const style = config.style || {};
  
  let css = `
    * {
      box-sizing: border-box;
    }
    
    body.md2pdf-body {
      font-family: ${style.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"};
      font-size: ${style.fontSize || '16px'};
      line-height: ${style.lineHeight || '1.6'};
      color: ${style.color || '#333333'};
      background-color: ${style.backgroundColor || '#ffffff'};
      max-width: 100%;
      margin: 0;
      padding: 20px;
    }

    h1.md2pdf-h1 {
      color: ${style.h1?.color || '#2c3e50'};
      border-bottom: ${style.h1?.borderBottom || '3px solid #3498db'};
      font-size: ${style.h1?.fontSize || '32px'};
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 20px;
    }

    h2.md2pdf-h2 {
      color: ${style.h2?.color || '#34495e'};
      border-bottom: ${style.h2?.borderBottom || '2px solid #95a5a6'};
      font-size: ${style.h2?.fontSize || '24px'};
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    h3.md2pdf-h3 {
      color: ${style.h3?.color || '#34495e'};
      font-size: ${style.h3?.fontSize || '20px'};
      margin-top: 25px;
      margin-bottom: 10px;
    }

    h4.md2pdf-h4, h5.md2pdf-h5, h6.md2pdf-h6 {
      color: ${style.h3?.color || '#34495e'};
      margin-top: 20px;
      margin-bottom: 10px;
    }

    p.md2pdf-p {
      margin: 0 0 16px 0;
    }

    code.md2pdf-code {
      background-color: ${style.code?.backgroundColor || '#f4f4f4'};
      color: ${style.code?.color || '#e74c3c'};
      font-size: ${style.code?.fontSize || '13px'};
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }

    pre.md2pdf-code-block {
      background-color: ${style.codeBlock?.backgroundColor || '#f8f8f8'};
      border: ${style.codeBlock?.border || '1px solid #ddd'};
      font-size: ${style.codeBlock?.fontSize || '13px'};
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 16px 0;
    }

    pre.md2pdf-code-block code {
      background: none;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }

    table.md2pdf-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }

    table.md2pdf-table th {
      background-color: ${style.table?.headerBackground || '#3498db'};
      color: ${style.table?.headerColor || '#ffffff'};
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    table.md2pdf-table td {
      border: 1px solid ${style.table?.borderColor || '#dddddd'};
      padding: 10px 12px;
    }

    table.md2pdf-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    blockquote.md2pdf-blockquote {
      border-left: ${style.blockquote?.borderLeft || '4px solid #3498db'};
      background-color: ${style.blockquote?.backgroundColor || '#f9f9f9'};
      color: ${style.blockquote?.color || '#666666'};
      margin: 16px 0;
      padding: 12px 20px;
      font-style: italic;
    }

    blockquote.md2pdf-blockquote p {
      margin: 0;
    }

    a.md2pdf-link {
      color: ${style.link?.color || '#3498db'};
      text-decoration: none;
    }

    a.md2pdf-link:hover {
      text-decoration: underline;
    }

    ul.md2pdf-list, ol.md2pdf-list {
      margin: 16px 0;
      padding-left: 30px;
    }

    li {
      margin: 8px 0;
    }

    img.md2pdf-image {
      max-width: 100%;
      height: auto;
      margin: 16px 0;
    }

    hr {
      border: none;
      border-top: 2px solid #eee;
      margin: 30px 0;
    }

    .md2pdf-toc {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .md2pdf-toc-title {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }

    .md2pdf-toc-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .md2pdf-toc-list li {
      margin: 8px 0;
    }

    .md2pdf-toc-list a {
      color: #3498db;
      text-decoration: none;
    }

    .md2pdf-toc-list a:hover {
      text-decoration: underline;
    }

    .hljs {
      display: block;
      overflow-x: auto;
      color: #333;
    }

    .hljs-comment,
    .hljs-quote {
      color: #998;
      font-style: italic;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-subst {
      color: #333;
      font-weight: bold;
    }

    .hljs-number,
    .hljs-literal,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-tag .hljs-attr {
      color: #008080;
    }

    .hljs-string,
    .hljs-doctag {
      color: #d14;
    }

    .hljs-title,
    .hljs-section,
    .hljs-selector-id {
      color: #900;
      font-weight: bold;
    }

    .hljs-type,
    .hljs-class .hljs-title {
      color: #458;
      font-weight: bold;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-attribute {
      color: #000080;
      font-weight: normal;
    }

    .hljs-regexp,
    .hljs-link {
      color: #009926;
    }

    .hljs-symbol,
    .hljs-bullet {
      color: #990073;
    }

    .hljs-built_in,
    .hljs-builtin-name {
      color: #0086b3;
    }

    .hljs-meta {
      color: #999;
      font-weight: bold;
    }

    .hljs-deletion {
      background: #fdd;
    }

    .hljs-addition {
      background: #dfd;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
  `;

  if (style.customCSS) {
    css += '\n' + style.customCSS;
  }

  return css;
}

module.exports = {
  buildStyles
};
