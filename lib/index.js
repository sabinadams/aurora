#!/usr/bin/env node
"use strict";
var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var path = require("path");
var program = require("commander");
clear();
console.log(chalk.red(figlet.textSync("Aurora", { horizontalLayout: "full" })));
program
    .version("0.0.1")
    .description("A tool that orchestrates prisma files in a way that allows multiple .prisma files with cross-relations")
    .option("-p, --peppers", "Add peppers")
    .parse(process.argv);
