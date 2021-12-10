"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuroraConfigJSON = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var CONSTANTS_1 = require("../util/CONSTANTS");
var readFile = (0, util_1.promisify)(fs_1.default.readFile);
/**
 *
 * @returns The configuration JSON object from the aurora configuration file
 */
function getAuroraConfigJSON() {
    return __awaiter(this, void 0, void 0, function () {
        var jsonString, config, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path_1.default.join(process.cwd(), CONSTANTS_1.CONFIG_FILE_NAME), { encoding: "utf-8" })];
                case 1:
                    jsonString = _a.sent();
                    config = JSON.parse(jsonString);
                    // Ensure all of the fields were provided and are valid
                    validateConfigurationObject(config);
                    return [2 /*return*/, JSON.parse(jsonString)];
                case 2:
                    e_1 = _a.sent();
                    console.error("Aurora could not load ".concat(CONSTANTS_1.CONFIG_FILE_NAME, ". Please make sure this file exists and is valid."));
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAuroraConfigJSON = getAuroraConfigJSON;
/**
 *
 * @param config The Configuration object to validate
 * @description Throws errors if anything is invalid
 */
var validateConfigurationObject = function (config) {
    var _a, _b;
    if (!Object.keys(config)) {
        console.error("Your ".concat(CONSTANTS_1.CONFIG_FILE_NAME, " is invalid or empty. Please make sure this file exists and is valid."));
        throw new Error(CONSTANTS_1.ERRORS.INVALID_CONFIG_FILE);
    }
    if (!((_a = config === null || config === void 0 ? void 0 : config.files) === null || _a === void 0 ? void 0 : _a.length)) {
        console.error("No Prisma Files provided. Please specify at least one prisma schema file to process.");
        throw new Error(CONSTANTS_1.ERRORS.EMPTY_CONFIG_FILES);
    }
    if (config.files.filter(function (file) { return !file.includes('.prisma'); }).length) {
        console.error("Invalid File. Only provide paths to .prisma files.");
        throw new Error(CONSTANTS_1.ERRORS.NON_PRISMA_FILE);
    }
    if (!((_b = config === null || config === void 0 ? void 0 : config.output) === null || _b === void 0 ? void 0 : _b.length)) {
        console.error("No Output location. Please specify where to output the generated file.");
        throw new Error(CONSTANTS_1.ERRORS.NO_OUTPUT_CONFIGURED);
    }
    if (!config.output.includes('.prisma')) {
        console.error("The Output file should have the .prisma extension.");
        throw new Error(CONSTANTS_1.ERRORS.NON_PRISMA_FILE);
    }
};
