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
exports.expandGlobPatterns = void 0;
var util_1 = require("util");
var glob_1 = __importDefault(require("glob"));
var CONSTANTS_1 = require("../util/CONSTANTS");
var glob = (0, util_1.promisify)(glob_1.default);
var expandGlobPatterns = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var result, _a, _b, _i, f, file, _c, _d, _e, e_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                result = { files: [], output: config.output };
                _a = [];
                for (_b in config.files)
                    _a.push(_b);
                _i = 0;
                _f.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3, 4];
                f = _a[_i];
                file = config.files[f];
                _c = result;
                _e = (_d = result.files).concat;
                return [4, _expandIfGlob(file)];
            case 2:
                _c.files = _e.apply(_d, [_f.sent()]);
                _f.label = 3;
            case 3:
                _i++;
                return [3, 1];
            case 4: return [2, result];
            case 5:
                e_1 = _f.sent();
                console.error("Aurora could not parse GLOB patterns in ".concat(CONSTANTS_1.CONFIG_FILE_NAME, " 'file' section. Please make sure these files exists and the GLOB pattern is valid."));
                throw e_1;
            case 6: return [2];
        }
    });
}); };
exports.expandGlobPatterns = expandGlobPatterns;
var _expandIfGlob = function (file) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            if (!glob_1.default.hasMagic(file)) return [3, 2];
            return [4, glob(file, { nonull: true })];
        case 1:
            _a = _b.sent();
            return [3, 3];
        case 2:
            _a = [file];
            _b.label = 3;
        case 3: return [2, _a];
    }
}); }); };
