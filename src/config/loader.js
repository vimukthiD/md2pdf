'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaults } = require('./defaults');

async function loadConfig(configPath) {
  const configs = [];

  if (configPath) {
    const customConfig = loadConfigFile(path.resolve(configPath));
    if (customConfig) {
      configs.push(customConfig);
    }
  } else {
    const projectConfig = loadConfigFile(path.resolve('md2pdf.config.json'));
    if (projectConfig) {
      configs.push(projectConfig);
    }

    const userConfigPath = path.join(os.homedir(), '.md2pdf', 'config.json');
    const userConfig = loadConfigFile(userConfigPath);
    if (userConfig) {
      configs.push(userConfig);
    }
  }

  let result = getDefaults();
  for (const config of configs.reverse()) {
    result = mergeConfigs(result, config);
  }

  return result;
}

function loadConfigFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : null;
      
      if (position !== null) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.substring(0, position).split('\n');
        const lineNumber = lines.length;
        throw new Error(`Invalid JSON syntax in ${filePath} at line ${lineNumber}: ${error.message}`);
      }
    }
    throw new Error(`Failed to load config file ${filePath}: ${error.message}`);
  }
}

function mergeConfigs(base, override) {
  const result = { ...base };

  for (const key of Object.keys(override)) {
    if (key.startsWith('//') || key.startsWith('$')) {
      continue;
    }

    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      base[key] !== null &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = mergeConfigs(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }

  return result;
}

module.exports = {
  loadConfig,
  loadConfigFile,
  mergeConfigs
};
