'use strict';

const { loadConfig, mergeConfigs } = require('./config/loader');
const { validateConfig } = require('./config/validator');
const { getDefaults, generateDefaultConfig } = require('./config/defaults');
const { convertMarkdownToPdf } = require('./converter/pdf-generator');
const { parseMarkdown } = require('./converter/markdown-parser');
const { generateHtml } = require('./converter/html-generator');
const { buildStyles } = require('./converter/style-builder');

module.exports = {
  loadConfig,
  mergeConfigs,
  validateConfig,
  getDefaults,
  generateDefaultConfig,
  convertMarkdownToPdf,
  parseMarkdown,
  generateHtml,
  buildStyles
};
