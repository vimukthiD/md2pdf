'use strict';

const fs = require('fs');
const path = require('path');

function mergeMarkdownFiles(filePaths, options = {}) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error('filePaths must be a non-empty array');
  }

  const separator = options.separator || '\n\n---\n\n';
  const addPageBreaks = options.addPageBreaks !== false;
  
  const mergedContent = filePaths.map((filePath, index) => {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (addPageBreaks && index > 0) {
      return `<div style="page-break-before: always;"></div>\n\n${content}`;
    }
    
    return content;
  }).join(separator);

  return mergedContent;
}

function getCommonBasePath(filePaths) {
  if (!filePaths || filePaths.length === 0) {
    return process.cwd();
  }

  if (filePaths.length === 1) {
    return path.dirname(path.resolve(filePaths[0]));
  }

  const resolvedPaths = filePaths.map(p => path.resolve(p));
  const parts = resolvedPaths.map(p => p.split(path.sep));
  
  const commonParts = [];
  for (let i = 0; i < parts[0].length; i++) {
    const part = parts[0][i];
    if (parts.every(p => p[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }

  return commonParts.join(path.sep) || path.sep;
}

module.exports = {
  mergeMarkdownFiles,
  getCommonBasePath
};
