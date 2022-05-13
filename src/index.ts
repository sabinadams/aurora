#!/usr/bin/env node

import { Command } from 'commander';
import aurora from './aurora';
import dotenv from 'dotenv';

// Get Env Vars
dotenv.config();

// CLI Command
const program = new Command();
program.parse(process.argv);

// Run aurora
aurora();
