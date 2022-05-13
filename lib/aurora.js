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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var CONSTANTS_1 = require("./util/CONSTANTS");
var renderer_1 = require("./helpers/renderer");
var sdk_1 = require("@prisma/sdk");
function aurora() {
    return __awaiter(this, void 0, void 0, function () {
        var config, schemas, models, enums, allDatasources, uniqueDatasources, datasource, allGenerators, generators, generator, output, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, (0, helpers_1.getAuroraConfigJSON)()];
                case 1:
                    config = _c.sent();
                    return [4, Promise.all(config.files.map(helpers_1.parseSchema))];
                case 2:
                    schemas = _c.sent();
                    models = (0, renderer_1.renderModels)((0, helpers_1.combineModels)(schemas.reduce(function (acc, curr) { return __spreadArray(__spreadArray([], acc, true), curr.models, true); }, [])));
                    enums = (0, renderer_1.renderEnums)((0, helpers_1.combineEnums)(schemas.reduce(function (acc, curr) { return __spreadArray(__spreadArray([], acc, true), curr.enums, true); }, [])));
                    allDatasources = schemas.reduce(function (acc, curr) { return __spreadArray(__spreadArray([], acc, true), curr.datasources, true); }, []);
                    uniqueDatasources = [];
                    allDatasources.forEach(function (datasource) {
                        if (!uniqueDatasources.some(function (source) { return JSON.stringify(source) === JSON.stringify(datasource); })) {
                            uniqueDatasources.push(datasource);
                        }
                    });
                    if (uniqueDatasources.length > 1) {
                        console.error("There were ".concat(uniqueDatasources.length, " different datasources provided. Make sure all of the datasources are the same."));
                        throw new Error(CONSTANTS_1.ERRORS.INVALID_SCHEMA);
                    }
                    return [4, (0, renderer_1.renderDatasources)(uniqueDatasources)];
                case 3:
                    datasource = _c.sent();
                    allGenerators = schemas.reduce(function (acc, curr) { return __spreadArray(__spreadArray([], acc, true), curr.generators, true); }, []);
                    generators = Array.from(new Set(allGenerators.map(function (gen) { return JSON.stringify(gen); }))).map(function (gen) { return JSON.parse(gen); });
                    generator = (0, renderer_1.renderGenerators)(generators);
                    output = ['// ◮◮◮ GENERATED BY AURORA ◮◮◮', datasource, generator, models, enums].join('\n');
                    _a = helpers_1.writeSchema;
                    _b = [config.output];
                    return [4, (0, sdk_1.formatSchema)({ schema: output })];
                case 4: return [4, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 5:
                    _c.sent();
                    console.log("\u25EE\u25EE\u25EE Succesfully built into ".concat(config.output, " \u25EE\u25EE\u25EE"));
                    return [2];
            }
        });
    });
}
exports.default = aurora;
