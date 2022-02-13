#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet = __importStar(require("figlet"));
var commander_1 = require("commander");
var aurora_1 = __importDefault(require("./aurora"));
var dotenv_1 = __importDefault(require("dotenv"));
// Get Env Vars
dotenv_1.default.config();
// Console Welcome
(0, clear_1.default)();
console.log(chalk_1.default.bold.magenta(figlet.textSync('Aurora', { horizontalLayout: 'full' })));
// CLI Command
var program = new commander_1.Command();
program
    .version('1.3.3')
    .description('A tool that orchestrates prisma files in a way that allows multiple .prisma files with cross-relations')
    .parse(process.argv);
// Run aurora
(0, aurora_1.default)();
