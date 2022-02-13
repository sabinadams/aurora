#!/usr/bin/env node

import { default as chalk } from 'chalk';
import clear from 'clear';
import * as figlet from 'figlet';
import { Command } from 'commander';
import aurora from './aurora';
import dotenv from 'dotenv';

// Get Env Vars
dotenv.config();

// Console Welcome
clear();
console.log(chalk.bold.magenta(figlet.textSync('Aurora', { horizontalLayout: 'full' })));

// CLI Command
const program = new Command();
program
  .version('1.3.3')
  .description(
    'A tool that orchestrates prisma files in a way that allows multiple .prisma files with cross-relations'
  )
  .parse(process.argv);

// Run aurora
aurora();
