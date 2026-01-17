'use strict';

const chalk = require('chalk');

let logLevel = 'normal';

const logger = {
  setLevel(level) {
    logLevel = level;
  },

  info(message) {
    if (logLevel !== 'quiet') {
      console.log(chalk.blue('ℹ'), message);
    }
  },

  success(message) {
    if (logLevel !== 'quiet') {
      console.log(chalk.green('✓'), message);
    }
  },

  warn(message) {
    if (logLevel !== 'quiet') {
      console.log(chalk.yellow('⚠'), message);
    }
  },

  error(message) {
    console.error(chalk.red('✗'), message);
  },

  verbose(message) {
    if (logLevel === 'verbose') {
      console.log(chalk.gray('→'), message);
    }
  }
};

module.exports = {
  logger
};
