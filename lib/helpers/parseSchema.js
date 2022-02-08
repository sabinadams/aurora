"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.parseSchema = void 0;
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var sdk_1 = require("@prisma/sdk");
var model_fields_1 = __importDefault(require("./CustomParsers/model-fields"));
var datasource_fields_1 = __importDefault(require("./CustomParsers/datasource-fields"));
var parse_blocks_1 = __importDefault(require("./CustomParsers/parse-blocks"));
var CONSTANTS_1 = require("../util/CONSTANTS");
var parseModels_1 = __importDefault(require("./parseModels"));
var path_1 = __importDefault(require("path"));
var readFile = (0, util_1.promisify)(fs_1.default.readFile);
/**
 *
 * @param filePath Path to the Prisma file we are parsing
 */
function parseSchema(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var datamodel, dmmf, config, datasourceBlocksFields_1, modelData, attributeData_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, readFile(path_1.default.join(process.cwd(), filePath), { encoding: 'utf-8' })];
                case 1:
                    datamodel = _a.sent();
                    return [4 /*yield*/, (0, sdk_1.formatSchema)({ schema: datamodel })];
                case 2:
                    // Formats the schema
                    datamodel = _a.sent();
                    return [4 /*yield*/, (0, sdk_1.getDMMF)({ datamodel: datamodel })];
                case 3:
                    dmmf = _a.sent();
                    return [4 /*yield*/, (0, sdk_1.getConfig)({ datamodel: datamodel })];
                case 4:
                    config = _a.sent();
                    datasourceBlocksFields_1 = (0, parse_blocks_1.default)('datasource', datamodel, datasource_fields_1.default);
                    // Add any of the unsupported fields to our object
                    config.datasources = config.datasources.map(function (datasource) {
                        var datasourceFields = datasourceBlocksFields_1.find(function (data) { return data[0].blockName == datasource.name; }) || [];
                        return __assign(__assign({}, datasource), datasourceFields.reduce(function (acc, curr) {
                            if (CONSTANTS_1.UNSUPPORTED_DATASOURCE_FIELDS.includes(curr.name)) {
                                acc[curr.name] = curr.value;
                            }
                            return acc;
                        }, {}));
                    });
                    modelData = (0, parseModels_1.default)(datamodel);
                    attributeData_1 = (0, model_fields_1.default)(modelData);
                    return [2 /*return*/, {
                            models: dmmf.datamodel.models.map(function (model) {
                                model.extendedFields = attributeData_1[model.name].filter(function (attribute) { return attribute.isFieldAttribute; });
                                model.extendedModelAttributes = attributeData_1[model.name]
                                    .filter(function (attribute) { return attribute.isModelAttribute; })
                                    .map(function (attribute) { return attribute.attributes; })
                                    .flat();
                                return model;
                            }),
                            enums: dmmf.datamodel.enums,
                            datasources: config.datasources,
                            generators: config.generators
                        }];
                case 5:
                    e_1 = _a.sent();
                    console.error(e_1, "Aurora could not parse the schema at ".concat(filePath, ". Please ensure it is of a proper format."));
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.parseSchema = parseSchema;
