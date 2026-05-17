'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { mergeMarkdownFiles, getCommonBasePath } = require('../src/utils/markdown-merger');

describe('Markdown Merger', () => {
  let tempDir;
  let testFiles;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md2pdf-test-'));
    testFiles = [];
  });

  afterEach(() => {
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  function createTestFile(filename, content) {
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    testFiles.push(filePath);
    return filePath;
  }

  describe('mergeMarkdownFiles', () => {
    test('merges multiple markdown files in order', () => {
      const file1 = createTestFile('file1.md', '# File 1\n\nContent 1');
      const file2 = createTestFile('file2.md', '# File 2\n\nContent 2');
      const file3 = createTestFile('file3.md', '# File 3\n\nContent 3');

      const result = mergeMarkdownFiles([file1, file2, file3]);

      expect(result).toContain('# File 1');
      expect(result).toContain('# File 2');
      expect(result).toContain('# File 3');
      expect(result.indexOf('# File 1')).toBeLessThan(result.indexOf('# File 2'));
      expect(result.indexOf('# File 2')).toBeLessThan(result.indexOf('# File 3'));
    });

    test('adds page breaks between files by default', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const file2 = createTestFile('file2.md', '# File 2');

      const result = mergeMarkdownFiles([file1, file2]);

      expect(result).toContain('page-break-before: always');
    });

    test('respects no page breaks option', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const file2 = createTestFile('file2.md', '# File 2');

      const result = mergeMarkdownFiles([file1, file2], { addPageBreaks: false });

      expect(result).not.toContain('page-break-before');
    });

    test('throws error for empty array', () => {
      expect(() => mergeMarkdownFiles([])).toThrow('filePaths must be a non-empty array');
    });

    test('throws error for non-array input', () => {
      expect(() => mergeMarkdownFiles('not-an-array')).toThrow('filePaths must be a non-empty array');
    });

    test('throws error for non-existent file', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const nonExistent = path.join(tempDir, 'nonexistent.md');

      expect(() => mergeMarkdownFiles([file1, nonExistent])).toThrow('File not found');
    });

    test('handles single file', () => {
      const file1 = createTestFile('file1.md', '# Single File\n\nContent');

      const result = mergeMarkdownFiles([file1]);

      expect(result).toBe('# Single File\n\nContent');
      expect(result).not.toContain('page-break-before');
    });

    test('uses custom separator when provided', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const file2 = createTestFile('file2.md', '# File 2');

      const result = mergeMarkdownFiles([file1, file2], { 
        separator: '\n\n<!-- CUSTOM SEPARATOR -->\n\n',
        addPageBreaks: false 
      });

      expect(result).toContain('<!-- CUSTOM SEPARATOR -->');
    });
  });

  describe('getCommonBasePath', () => {
    test('returns current directory for empty array', () => {
      const result = getCommonBasePath([]);
      expect(result).toBe(process.cwd());
    });

    test('returns parent directory for single file', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const result = getCommonBasePath([file1]);
      expect(result).toBe(tempDir);
    });

    test('returns common parent for files in same directory', () => {
      const file1 = createTestFile('file1.md', '# File 1');
      const file2 = createTestFile('file2.md', '# File 2');

      const result = getCommonBasePath([file1, file2]);
      expect(result).toBe(tempDir);
    });

    test('returns common ancestor for files in different directories', () => {
      const subDir1 = path.join(tempDir, 'sub1');
      const subDir2 = path.join(tempDir, 'sub2');
      fs.mkdirSync(subDir1);
      fs.mkdirSync(subDir2);

      const file1 = path.join(subDir1, 'file1.md');
      const file2 = path.join(subDir2, 'file2.md');
      fs.writeFileSync(file1, '# File 1', 'utf-8');
      fs.writeFileSync(file2, '# File 2', 'utf-8');
      testFiles.push(file1, file2);

      const result = getCommonBasePath([file1, file2]);
      expect(result).toBe(tempDir);

      fs.unlinkSync(file1);
      fs.unlinkSync(file2);
      fs.rmdirSync(subDir1);
      fs.rmdirSync(subDir2);
    });
  });
});
