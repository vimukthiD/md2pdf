'use strict';

const { getDefaults, generateDefaultConfig } = require('../src/config/defaults');
const { mergeConfigs, loadConfigFile } = require('../src/config/loader');
const { validateConfig } = require('../src/config/validator');

describe('Config Defaults', () => {
  test('getDefaults returns valid config object', () => {
    const defaults = getDefaults();
    expect(defaults).toBeDefined();
    expect(defaults.footer).toBeDefined();
    expect(defaults.header).toBeDefined();
    expect(defaults.page).toBeDefined();
    expect(defaults.style).toBeDefined();
    expect(defaults.variables).toBeDefined();
  });

  test('getDefaults returns a deep copy', () => {
    const defaults1 = getDefaults();
    const defaults2 = getDefaults();
    defaults1.footer.enabled = false;
    expect(defaults2.footer.enabled).toBe(true);
  });

  test('generateDefaultConfig returns valid config', () => {
    const config = generateDefaultConfig();
    expect(config).toBeDefined();
    expect(config.$schema).toBeDefined();
    expect(config.footer).toBeDefined();
    expect(config.variables).toBeDefined();
  });
});

describe('Config Merger', () => {
  test('mergeConfigs merges nested objects', () => {
    const base = { a: { b: 1, c: 2 } };
    const override = { a: { b: 3 } };
    const result = mergeConfigs(base, override);
    expect(result.a.b).toBe(3);
    expect(result.a.c).toBe(2);
  });

  test('mergeConfigs ignores comment keys', () => {
    const base = { a: 1 };
    const override = { '// comment': 'test', a: 2 };
    const result = mergeConfigs(base, override);
    expect(result['// comment']).toBeUndefined();
    expect(result.a).toBe(2);
  });

  test('mergeConfigs handles arrays by replacement', () => {
    const base = { arr: [1, 2, 3] };
    const override = { arr: [4, 5] };
    const result = mergeConfigs(base, override);
    expect(result.arr).toEqual([4, 5]);
  });
});

describe('Config Validator', () => {
  test('validates correct config', () => {
    const config = getDefaults();
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validates page format', () => {
    const config = { page: { format: 'InvalidFormat' } };
    const result = validateConfig(config);
    expect(result.valid).toBe(false);
  });

  test('warns on unknown properties', () => {
    const config = { unknownProp: 'value' };
    const result = validateConfig(config);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('validates color formats', () => {
    const config = { footer: { color: '#fff' } };
    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });
});
