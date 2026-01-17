'use strict';

const fs = require('fs');
const path = require('path');

function validateInput(inputPath) {
  if (!fs.existsSync(inputPath)) {
    return {
      valid: false,
      error: `Input file not found: ${inputPath}`
    };
  }

  try {
    fs.accessSync(inputPath, fs.constants.R_OK);
  } catch {
    return {
      valid: false,
      error: `Cannot read file: ${inputPath} (Permission denied)`
    };
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.md' && ext !== '.markdown') {
    return {
      valid: false,
      error: `Invalid file type: ${ext} (expected .md or .markdown)`
    };
  }

  return { valid: true };
}

function validateOutput(outputPath) {
  const dir = path.dirname(outputPath);
  
  if (!fs.existsSync(dir)) {
    return {
      valid: false,
      error: `Output directory does not exist: ${dir}`
    };
  }

  try {
    fs.accessSync(dir, fs.constants.W_OK);
  } catch {
    return {
      valid: false,
      error: `Cannot write to output directory: ${dir} (Permission denied)`
    };
  }

  return { valid: true };
}

function checkDiskSpace(_outputPath, _requiredBytes = 5 * 1024 * 1024) {
  return { valid: true };
}

module.exports = {
  validateInput,
  validateOutput,
  checkDiskSpace
};
