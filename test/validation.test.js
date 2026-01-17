'use strict';

const path = require('path');
const { validateInput, validateOutput } = require('../src/utils/validation');

describe('Input Validation', () => {
  test('validates existing markdown file', () => {
    const testFile = path.join(__dirname, '../README.md');
    const result = validateInput(testFile);
    expect(result.valid).toBe(true);
  });

  test('rejects non-existent file', () => {
    const result = validateInput('/nonexistent/file.md');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not found');
  });

  test('rejects non-markdown file', () => {
    const testFile = path.join(__dirname, '../package.json');
    const result = validateInput(testFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });
});

describe('Output Validation', () => {
  test('validates existing directory', () => {
    const result = validateOutput('/tmp/test.pdf');
    expect(result.valid).toBe(true);
  });

  test('rejects non-existent directory', () => {
    const result = validateOutput('/nonexistent/path/test.pdf');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('does not exist');
  });
});
