'use strict';

const { parseMarkdown, extractHeaders, generateToc } = require('./markdown-parser');
const { buildStyles } = require('./style-builder');
const { substituteVariables } = require('../utils/variables');

function generateHtml(markdownContent, config, filename) {
  const headers = extractHeaders(markdownContent);
  let htmlContent = parseMarkdown(markdownContent);
  
  htmlContent = addCssClasses(htmlContent);
  
  const toc = generateToc(headers, config);
  
  if (toc && config.toc?.position === 'start') {
    htmlContent = toc + htmlContent;
  } else if (toc && config.toc?.position === 'end') {
    htmlContent = htmlContent + toc;
  } else if (toc) {
    htmlContent = toc + htmlContent;
  }

  const styles = buildStyles(config);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>${styles}</style>
</head>
<body class="md2pdf-body">
${htmlContent}
</body>
</html>`;

  return html;
}

function addCssClasses(html) {
  html = html.replace(/<h1([^>]*)>/g, '<h1$1 class="md2pdf-h1">');
  html = html.replace(/<h2([^>]*)>/g, '<h2$1 class="md2pdf-h2">');
  html = html.replace(/<h3([^>]*)>/g, '<h3$1 class="md2pdf-h3">');
  html = html.replace(/<h4([^>]*)>/g, '<h4$1 class="md2pdf-h4">');
  html = html.replace(/<h5([^>]*)>/g, '<h5$1 class="md2pdf-h5">');
  html = html.replace(/<h6([^>]*)>/g, '<h6$1 class="md2pdf-h6">');
  html = html.replace(/<p>/g, '<p class="md2pdf-p">');
  html = html.replace(/<code(?![^>]*class=)/g, '<code class="md2pdf-code"');
  html = html.replace(/<table>/g, '<table class="md2pdf-table">');
  html = html.replace(/<blockquote>/g, '<blockquote class="md2pdf-blockquote">');
  html = html.replace(/<a /g, '<a class="md2pdf-link" ');
  html = html.replace(/<ul>/g, '<ul class="md2pdf-list">');
  html = html.replace(/<ol>/g, '<ol class="md2pdf-list">');
  html = html.replace(/<img /g, '<img class="md2pdf-image" ');
  
  return html;
}

function generateHeaderFooterTemplate(config, type, filename) {
  const section = config[type];
  
  if (!section?.enabled) {
    return '';
  }

  const fontSize = section.fontSize || '9px';
  const color = section.color || '#666666';
  const padding = section.padding || '5px 20px';

  const left = substituteVariables(section.left || '', config.variables, filename);
  const center = substituteVariables(section.center || '', config.variables, filename);
  const right = substituteVariables(section.right || '', config.variables, filename);

  return `
    <div style="width: 100%; font-size: ${fontSize}; color: ${color}; padding: ${padding}; display: flex; justify-content: space-between; align-items: center;">
      <span style="flex: 1; text-align: left;">${left}</span>
      <span style="flex: 1; text-align: center;">${center}</span>
      <span style="flex: 1; text-align: right;">${right}</span>
    </div>
  `;
}

module.exports = {
  generateHtml,
  addCssClasses,
  generateHeaderFooterTemplate
};
