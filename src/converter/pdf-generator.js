'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { generateHtml, generateHeaderFooterTemplate } = require('./html-generator');

async function convertMarkdownToPdf(input, outputPath, config, options = {}) {
  let markdownContent;
  let filename;
  let basePath;

  if (options.isContent) {
    markdownContent = input;
    filename = path.basename(outputPath, path.extname(outputPath));
    basePath = options.basePath || process.cwd();
  } else {
    const inputPath = input;
    markdownContent = fs.readFileSync(inputPath, 'utf-8');
    filename = path.basename(inputPath, path.extname(inputPath));
    basePath = path.dirname(path.resolve(inputPath));
  }

  const html = generateHtml(markdownContent, config, filename);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    const baseUrl = `file://${basePath}/`;
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    /* eslint-disable no-undef */
    await page.evaluate((base) => {
      const baseEl = document.createElement('base');
      baseEl.href = base;
      document.head.prepend(baseEl);
    }, baseUrl);
    /* eslint-enable no-undef */

    const pdfOptions = {
      path: outputPath,
      format: config.page?.format || 'A4',
      margin: config.page?.margin || {
        top: '2cm',
        right: '2cm',
        bottom: '2.5cm',
        left: '2cm'
      },
      printBackground: config.page?.printBackground !== false,
      preferCSSPageSize: config.output?.preferCSSPageSize || false
    };

    if (config.output?.displayHeaderFooter !== false) {
      const headerTemplate = generateHeaderFooterTemplate(config, 'header', filename);
      const footerTemplate = generateHeaderFooterTemplate(config, 'footer', filename);
      
      if (headerTemplate || footerTemplate) {
        pdfOptions.displayHeaderFooter = true;
        pdfOptions.headerTemplate = headerTemplate || '<span></span>';
        pdfOptions.footerTemplate = footerTemplate || '<span></span>';
      }
    }

    await page.pdf(pdfOptions);
  } finally {
    await browser.close();
  }
}

module.exports = {
  convertMarkdownToPdf
};
