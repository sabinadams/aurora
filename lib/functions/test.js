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
exports.deserializeEnums = exports.deserializeGenerators = exports.deserializeDatasources = exports.deserializeModels = void 0;
function valueIs(value, types) {
    return types.map(function (type) { return type.name.toLowerCase() == typeof value; }).includes(true);
}
var renderAttribute = function (field) {
    var kind = field.kind, type = field.type;
    return {
        default: function (value) {
            if (value == null || value == undefined)
                return '';
            // convert value to a string, only if kind is scalar and NOT a BigInt
            if (kind === 'scalar' && type !== 'BigInt' && typeof value == 'string')
                value = "\"".concat(value, "\"");
            // if number, string or boolean we are ready to return!
            if (valueIs(value, [Number, String, Boolean]) || kind === 'enum')
                return "@default(".concat(value, ")");
            // haven't yet found where this is actually useful — will get back on that
            if (typeof value === 'object')
                return "@default(".concat(value.name, "(").concat(value.args, "))");
            throw new Error("Prismix: Unsupported field attribute ".concat(value));
        },
        isId: function (value) { return (value ? '@id' : ''); },
        isUnique: function (value) { return (value ? '@unique' : ''); },
        isUpdatedAt: function (value) { return (value ? '@updatedAt' : ''); },
        columnName: function (value) { return (value ? "@map(\"".concat(value, "\")") : ''); }
    };
};
// Render a line of field attributes
function renderAttributes(field) {
    var relationFromFields = field.relationFromFields, relationToFields = field.relationToFields, relationName = field.relationName, kind = field.kind;
    // handle attributes for scalar and enum fields
    if (kind == 'scalar' || kind == 'enum') {
        return "".concat(Object.keys(field)
            // if we have a method defined above with that property, call the method
            .map(function (property) {
            return renderAttribute(field)[property] && renderAttribute(field)[property](field[property]);
        })
            // filter out empty strings
            .filter(function (x) { return !!x; })
            .join(' '));
    }
    // handle relation syntax
    if (relationFromFields && kind === 'object') {
        return relationFromFields.length > 0
            ? "@relation(name: \"".concat(relationName, "\", fields: [").concat(relationFromFields, "], references: [").concat(relationToFields, "])")
            : "@relation(name: \"".concat(relationName, "\")");
    }
    return '';
}
// render all fields present on a model
function renderModelFields(fields) {
    return fields.map(function (field) {
        var name = field.name, kind = field.kind, type = field.type, isRequired = field.isRequired, isList = field.isList;
        if (kind == 'scalar')
            return "".concat(name, " ").concat(type).concat(isRequired ? '' : '?', " ").concat(renderAttributes(field));
        if (kind == 'object' || kind == 'enum')
            return "".concat(name, " ").concat(type).concat(isList ? '[]' : isRequired ? '' : '?', " ").concat(renderAttributes(field));
        throw new Error("Prismix: Unsupported field kind \"".concat(kind, "\""));
    });
}
function renderIdFieldsOrPrimaryKey(idFields) {
    // as of Prisma version ^2.30.0 idFields has become primaryKey, we should support both
    if (!idFields)
        return ''; // <- this is a hotfix until it can be looked into
    return idFields.length > 0 ? "@@id([".concat(idFields.join(', '), "])") : '';
}
function renderUniqueFields(uniqueFields) {
    return uniqueFields.length > 0
        ? uniqueFields.map(function (eachUniqueField) { return "@@unique([".concat(eachUniqueField.join(', '), "])"); })
        : [];
}
function renderDbName(dbName) {
    return dbName ? "@@map(\"".concat(dbName, "\")") : '';
}
function renderUrl(envValue) {
    var value = envValue.fromEnvVar ? "env(\"".concat(envValue.fromEnvVar, "\")") : "\"".concat(envValue.value, "\"");
    return "url = ".concat(value);
}
function renderProvider(provider) {
    return "provider = \"".concat(provider, "\"");
}
function renderOutput(path) {
    return path ? "output = \"".concat(path, "\"") : '';
}
function renderBinaryTargets(binaryTargets) {
    return (binaryTargets === null || binaryTargets === void 0 ? void 0 : binaryTargets.length) ? "binaryTargets = ".concat(JSON.stringify(binaryTargets)) : '';
}
function renderPreviewFeatures(previewFeatures) {
    return previewFeatures.length ? "previewFeatures = ".concat(JSON.stringify(previewFeatures)) : '';
}
// This function will render a code block with suitable indenting
function renderBlock(type, name, things) {
    return "".concat(type, " ").concat(name, " {\n").concat(things
        .filter(function (thing) { return thing.length > 1; })
        .map(function (thing) { return "\t".concat(thing); })
        .join('\n'), "\n}");
}
function deserializeModel(model) {
    var name = model.name, fields = model.fields, uniqueFields = model.uniqueFields, dbName = model.dbName, idFields = model.idFields, primaryKey = model.primaryKey;
    return renderBlock('model', name, __spreadArray(__spreadArray(__spreadArray([], renderModelFields(fields), true), renderUniqueFields(uniqueFields), true), [
        renderDbName(dbName),
        renderIdFieldsOrPrimaryKey(idFields || (primaryKey === null || primaryKey === void 0 ? void 0 : primaryKey.fields))
    ], false));
}
function deserializeDatasource(datasource) {
    var provider = datasource.activeProvider, name = datasource.name, url = datasource.url;
    return renderBlock('datasource', name, [renderProvider(provider), renderUrl(url)]);
}
function deserializeGenerator(generator) {
    var binaryTargets = generator.binaryTargets, name = generator.name, output = generator.output, provider = generator.provider, previewFeatures = generator.previewFeatures;
    return renderBlock('generator', name, [
        renderProvider(provider.value),
        renderOutput((output === null || output === void 0 ? void 0 : output.value) || null),
        renderBinaryTargets(binaryTargets),
        renderPreviewFeatures(previewFeatures)
    ]);
}
function deserializeEnum(_a) {
    var name = _a.name, values = _a.values, dbName = _a.dbName;
    var outputValues = values.map(function (_a) {
        var name = _a.name, dbName = _a.dbName;
        var result = name;
        if (name !== dbName && dbName)
            result += "@map(\"".concat(dbName, "\")");
        return result;
    });
    return renderBlock('enum', name, __spreadArray(__spreadArray([], outputValues, true), [renderDbName(dbName || null)], false));
}
// Exportable methods
function deserializeModels(models) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, models.map(function (model) { return deserializeModel(model); }).join('\n')];
        });
    });
}
exports.deserializeModels = deserializeModels;
function deserializeDatasources(datasources) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, datasources.map(function (datasource) { return deserializeDatasource(datasource); }).join('\n')];
        });
    });
}
exports.deserializeDatasources = deserializeDatasources;
function deserializeGenerators(generators) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, generators.map(function (generator) { return deserializeGenerator(generator); }).join('\n')];
        });
    });
}
exports.deserializeGenerators = deserializeGenerators;
function deserializeEnums(enums) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, enums.map(function (each) { return deserializeEnum(each); }).join('\n')];
        });
    });
}
exports.deserializeEnums = deserializeEnums;
