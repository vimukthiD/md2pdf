'use strict';

const { substituteVariables } = require('../src/utils/variables');

describe('Variable Substitution', () => {
  test('substitutes basic variables', () => {
    const template = 'Hello {author}!';
    const variables = { author: 'John' };
    const result = substituteVariables(template, variables, 'test');
    expect(result).toBe('Hello John!');
  });

  test('substitutes year variable', () => {
    const template = '© {year}';
    const variables = { year: '2025' };
    const result = substituteVariables(template, variables, 'test');
    expect(result).toBe('© 2025');
  });

  test('substitutes auto year', () => {
    const template = '© {year}';
    const variables = { year: 'auto' };
    const result = substituteVariables(template, variables, 'test');
    const currentYear = new Date().getFullYear().toString();
    expect(result).toBe(`© ${currentYear}`);
  });

  test('substitutes filename', () => {
    const template = 'File: {filename}';
    const result = substituteVariables(template, {}, 'document');
    expect(result).toBe('File: document');
  });

  test('substitutes page numbers', () => {
    const template = 'Page {page} of {total}';
    const result = substituteVariables(template, {}, 'test');
    expect(result).toContain('pageNumber');
    expect(result).toContain('totalPages');
  });

  test('handles empty template', () => {
    const result = substituteVariables('', {}, 'test');
    expect(result).toBe('');
  });

  test('handles null template', () => {
    const result = substituteVariables(null, {}, 'test');
    expect(result).toBe('');
  });

  test('handles missing variables', () => {
    const template = 'Hello {unknown}!';
    const result = substituteVariables(template, {}, 'test');
    expect(result).toBe('Hello {unknown}!');
  });
});
