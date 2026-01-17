'use strict';

const Ajv = require('ajv');
const schema = require('./schema.json');

const VALID_PAGE_FORMATS = ['A4', 'Letter', 'Legal', 'A3', 'A5', 'Tabloid'];
const COLOR_REGEX = /^(#[0-9A-Fa-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
const SIZE_REGEX = /^\d+(\.\d+)?(px|pt|em|rem|cm|mm|in|%)$/;

function validateConfig(config) {
  const errors = [];
  const warnings = [];

  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid && validate.errors) {
    for (const error of validate.errors) {
      errors.push(`${error.instancePath || 'config'}: ${error.message}`);
    }
  }

  if (config.page?.format && !VALID_PAGE_FORMATS.includes(config.page.format)) {
    errors.push(`Invalid page format: "${config.page.format}" (supported: ${VALID_PAGE_FORMATS.join(', ')})`);
  }

  validateColors(config, errors);
  validateSizes(config, warnings);
  checkUnknownProperties(config, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateColors(config, errors) {
  const colorPaths = [
    ['footer', 'color'],
    ['header', 'color'],
    ['style', 'color'],
    ['style', 'h1', 'color'],
    ['style', 'h2', 'color'],
    ['style', 'h3', 'color'],
    ['style', 'code', 'color'],
    ['style', 'table', 'headerColor'],
    ['style', 'table', 'borderColor'],
    ['style', 'blockquote', 'color'],
    ['style', 'link', 'color']
  ];

  for (const pathArr of colorPaths) {
    const value = getNestedValue(config, pathArr);
    if (value && !COLOR_REGEX.test(value)) {
      errors.push(`Invalid color format at ${pathArr.join('.')}: "${value}" (expected hex, rgb, rgba, or named color)`);
    }
  }
}

function validateSizes(config, warnings) {
  const sizePaths = [
    ['footer', 'fontSize'],
    ['header', 'fontSize'],
    ['style', 'fontSize'],
    ['style', 'h1', 'fontSize'],
    ['style', 'h2', 'fontSize'],
    ['style', 'h3', 'fontSize'],
    ['style', 'code', 'fontSize'],
    ['style', 'codeBlock', 'fontSize']
  ];

  for (const pathArr of sizePaths) {
    const value = getNestedValue(config, pathArr);
    if (value && !SIZE_REGEX.test(value)) {
      warnings.push(`Unusual size format at ${pathArr.join('.')}: "${value}"`);
    }
  }
}

function checkUnknownProperties(config, warnings) {
  const knownTopLevel = [
    'footer', 'header', 'page', 'style', 'variables', 'output', 'toc', 'theme', 'themes', '$schema'
  ];

  for (const key of Object.keys(config)) {
    if (!key.startsWith('//') && !knownTopLevel.includes(key)) {
      const suggestion = findSimilar(key, knownTopLevel);
      const msg = suggestion 
        ? `Unknown property "${key}" (did you mean "${suggestion}"?)`
        : `Unknown property "${key}"`;
      warnings.push(msg);
    }
  }
}

function getNestedValue(obj, pathArr) {
  let current = obj;
  for (const key of pathArr) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function findSimilar(input, candidates) {
  const inputLower = input.toLowerCase();
  for (const candidate of candidates) {
    if (candidate.toLowerCase().includes(inputLower) || inputLower.includes(candidate.toLowerCase())) {
      return candidate;
    }
  }
  return null;
}

module.exports = {
  validateConfig,
  VALID_PAGE_FORMATS,
  COLOR_REGEX,
  SIZE_REGEX
};
