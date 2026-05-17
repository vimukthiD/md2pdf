#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');

const { loadConfig, mergeConfigs } = require('../src/config/loader');
const { validateConfig } = require('../src/config/validator');
const { getDefaults, generateDefaultConfig } = require('../src/config/defaults');
const { convertMarkdownToPdf } = require('../src/converter/pdf-generator');
const { validateInput } = require('../src/utils/validation');
const { logger } = require('../src/utils/logger');
const { mergeMarkdownFiles, getCommonBasePath } = require('../src/utils/markdown-merger');

const packageJson = require('../package.json');

program
  .name('md2pdf')
  .description('Convert Markdown files to professionally formatted PDFs')
  .version(packageJson.version, '-v, --version', 'Show version number')
  .argument('[inputs...]', 'Path to input Markdown file(s) - can specify multiple files')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-o, --output <path>', 'Output PDF path')
  .option('--init', 'Generate default config file (md2pdf.config.json)')
  .option('--validate', 'Validate configuration file without converting')
  .option('--no-config', 'Ignore all configuration files, use defaults only')
  .option('--theme <name>', 'Use a built-in theme (default, minimal, dark, professional)')
  .option('--css <path>', 'Path to custom CSS file')
  .option('--verbose', 'Show detailed conversion process')
  .option('--quiet', 'Suppress all output except errors')
  .option('--no-page-breaks', 'Disable automatic page breaks between merged files')
  .action(async (inputs, options) => {
    try {
      if (options.verbose) {
        logger.setLevel('verbose');
      } else if (options.quiet) {
        logger.setLevel('quiet');
      }

      if (options.init) {
        await handleInit(options);
        return;
      }

      if (options.validate) {
        await handleValidate(options);
        return;
      }

      if (!inputs || inputs.length === 0) {
        program.help();
        return;
      }

      await handleConvert(inputs, options);
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }
  });

async function handleInit(options) {
  const outputPath = options.output || 'md2pdf.config.json';
  
  if (fs.existsSync(outputPath)) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question(chalk.yellow(`File ${outputPath} already exists. Overwrite? (y/N) `), resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      logger.info('Aborted.');
      return;
    }
  }

  const defaultConfig = generateDefaultConfig();
  fs.writeFileSync(outputPath, JSON.stringify(defaultConfig, null, 2));
  logger.success(`Configuration file created: ${outputPath}`);
}

async function handleValidate(options) {
  const spinner = ora('Validating configuration...').start();
  
  try {
    const config = await loadConfig(options.config);
    const result = validateConfig(config);
    
    if (result.valid) {
      spinner.succeed(chalk.green('Configuration is valid'));
      if (result.warnings.length > 0) {
        result.warnings.forEach(w => logger.warn(w));
      }
    } else {
      spinner.fail(chalk.red('Configuration is invalid'));
      result.errors.forEach(e => logger.error(e));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.red('Validation failed'));
    logger.error(error.message);
    process.exit(1);
  }
}

async function handleConvert(inputs, options) {
  const isMultiFile = inputs.length > 1;

  if (isMultiFile) {
    await handleMultiFileConvert(inputs, options);
  } else {
    await handleSingleFileConvert(inputs[0], options);
  }
}

async function handleSingleFileConvert(input, options) {
  const inputPath = path.resolve(input);

  const validation = validateInput(inputPath);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const outputPath = options.output || inputPath.replace(/\.md$/i, '.pdf');

  let config = getDefaults();

  if (options.config !== false) {
    const loadedConfig = await loadConfig(options.config);
    config = mergeConfigs(config, loadedConfig);
  }

  if (options.theme) {
    const themeConfig = loadTheme(options.theme);
    config = mergeConfigs(config, themeConfig);
  }

  if (options.css) {
    const cssPath = path.resolve(options.css);
    if (fs.existsSync(cssPath)) {
      config.style = config.style || {};
      config.style.customCSS = fs.readFileSync(cssPath, 'utf-8');
    } else {
      throw new Error(`CSS file not found: ${options.css}`);
    }
  }

  const validationResult = validateConfig(config);
  if (!validationResult.valid) {
    throw new Error(`Invalid configuration: ${validationResult.errors.join(', ')}`);
  }

  const spinner = ora('Converting Markdown to PDF...').start();

  try {
    await convertMarkdownToPdf(inputPath, outputPath, config);
    spinner.succeed(chalk.green(`PDF created: ${outputPath}`));
  } catch (error) {
    spinner.fail(chalk.red('Conversion failed'));
    throw error;
  }
}

async function handleMultiFileConvert(inputs, options) {
  const inputPaths = inputs.map(input => path.resolve(input));

  for (const inputPath of inputPaths) {
    const validation = validateInput(inputPath);
    if (!validation.valid) {
      throw new Error(`${inputPath}: ${validation.error}`);
    }
  }

  if (!options.output) {
    throw new Error('Output path (-o, --output) is required when converting multiple files');
  }

  const outputPath = path.resolve(options.output);

  let config = getDefaults();

  if (options.config !== false) {
    const loadedConfig = await loadConfig(options.config);
    config = mergeConfigs(config, loadedConfig);
  }

  if (options.theme) {
    const themeConfig = loadTheme(options.theme);
    config = mergeConfigs(config, themeConfig);
  }

  if (options.css) {
    const cssPath = path.resolve(options.css);
    if (fs.existsSync(cssPath)) {
      config.style = config.style || {};
      config.style.customCSS = fs.readFileSync(cssPath, 'utf-8');
    } else {
      throw new Error(`CSS file not found: ${options.css}`);
    }
  }

  const validationResult = validateConfig(config);
  if (!validationResult.valid) {
    throw new Error(`Invalid configuration: ${validationResult.errors.join(', ')}`);
  }

  const spinner = ora(`Converting ${inputPaths.length} Markdown files to PDF...`).start();

  try {
    const mergeOptions = {
      addPageBreaks: options.pageBreaks !== false
    };

    const mergedContent = mergeMarkdownFiles(inputPaths, mergeOptions);
    const basePath = getCommonBasePath(inputPaths);

    await convertMarkdownToPdf(mergedContent, outputPath, config, {
      isContent: true,
      basePath: basePath
    });

    spinner.succeed(chalk.green(`PDF created from ${inputPaths.length} files: ${outputPath}`));
  } catch (error) {
    spinner.fail(chalk.red('Conversion failed'));
    throw error;
  }
}

function loadTheme(themeName) {
  const themePath = path.join(__dirname, '..', 'themes', `${themeName}.json`);
  
  if (!fs.existsSync(themePath)) {
    const availableThemes = ['default', 'minimal', 'dark', 'professional'];
    throw new Error(`Theme not found: ${themeName}. Available themes: ${availableThemes.join(', ')}`);
  }
  
  return JSON.parse(fs.readFileSync(themePath, 'utf-8'));
}

program.parse();
