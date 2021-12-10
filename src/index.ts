#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import * as figlet from "figlet";
import program from "commander";
import aurora from "./aurora";
import dotenv from "dotenv";
dotenv.config();

clear();
console.log(chalk.red(figlet.textSync("Aurora", { horizontalLayout: "full" })));

program
  .version("0.0.1")
  .description(
    "A tool that orchestrates prisma files in a way that allows multiple .prisma files with cross-relations"
  )
  .option("-p, --peppers", "Add peppers")
  .parse(process.argv);

aurora();