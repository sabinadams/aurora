#!/usr/bin/env node

import { Command } from 'commander';
import aurora from './aurora';
import dotenv from 'dotenv';

// Get Env Vars
dotenv.config();

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
