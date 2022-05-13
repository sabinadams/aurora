#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var aurora_1 = __importDefault(require("./aurora"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var program = new commander_1.Command();
program.parse(process.argv);
(0, aurora_1.default)();
