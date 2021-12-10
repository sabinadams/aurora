"use strict";
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
exports.renderEnums = exports.renderModels = exports.renderGenerators = exports.renderDatasources = void 0;
function renderBlock(type, name, items) {
    return "".concat(type, " ").concat(name, " {\n").concat(items
        .filter(function (item) { return item.length > 1; })
        .map(function (item) { return "\t".concat(item); })
        .join("\n"), "\n}");
}
function renderAttribute(name, value, options) {
    if (options === void 0) { options = {
        env: false,
        quotes: false,
    }; }
    if (!(value === null || value === void 0 ? void 0 : value.length))
        return "";
    if ((options === null || options === void 0 ? void 0 : options.quotes) || (options === null || options === void 0 ? void 0 : options.env))
        value = "\"".concat(value, "\"");
    if (options === null || options === void 0 ? void 0 : options.env)
        value = "env(".concat(value, ")");
    return "".concat(name, " = ").concat(value);
}
function renderFieldRelation(field) {
    return field.relationFromFields.length > 0
        ? " @relation(name: \"".concat(field.relationName, "\", fields: [").concat(field.relationFromFields, "], references: [").concat(field.relationToFields, "])")
        : " @relation(name: \"".concat(field.relationName, "\")");
}
function renderDefaultAttribute(field) {
    if (field.default == null || field.default === undefined)
        return '';
    var defaultString;
    if (typeof field.default === 'object') {
        defaultString = "".concat(field.default.name, "(").concat(field.default.args, ")");
    }
    else {
        defaultString = field === null || field === void 0 ? void 0 : field.default;
        if (field.kind === 'scalar' && field.type !== 'BigInt' && typeof field.default == 'string')
            defaultString = "\"".concat(defaultString, "\"");
    }
    return "@default(".concat(defaultString, ")");
}
function renderField(field) {
    var _a;
    var validKinds = ['scalar', 'object', 'enum'];
    if (!validKinds.includes(field.kind))
        throw new Error("Unsupported field kind \"".concat(field.kind, "\""));
    var fieldString = "".concat(field.name, " ").concat(field.type);
    if (field.isList) {
        fieldString = "".concat(fieldString, "[]");
    }
    else if (!field.isRequired || ['enum', 'object'].includes(field.kind)) {
        fieldString = "".concat(fieldString, "?");
    }
    if (field.isId) {
        fieldString = "".concat(fieldString, " @id");
    }
    if (field.isUnique) {
        fieldString = "".concat(fieldString, " @unique");
    }
    if (field.isUpdatedAt) {
        fieldString = "".concat(fieldString, " @updatedAt");
    }
    if ((_a = field === null || field === void 0 ? void 0 : field.columnName) === null || _a === void 0 ? void 0 : _a.length) {
        fieldString = "".concat(fieldString, " @map(\"").concat(field.columnName, "\")");
    }
    if (field.hasDefaultValue) {
        fieldString = "".concat(fieldString, " ").concat(renderDefaultAttribute(field));
    }
    if (field.relationName) {
        fieldString = "".concat(fieldString, " ").concat(renderFieldRelation(field));
    }
    return fieldString;
}
function renderDatasources(datasources) {
    return datasources
        .map(function (_a) {
        var activeProvider = _a.activeProvider, name = _a.name, config = _a.url;
        return renderBlock("datasource", name, [
            renderAttribute("provider", activeProvider, { quotes: true }),
            renderAttribute("url", config.fromEnvVar ? config.fromEnvVar : config.value, { env: config.fromEnvVar ? true : false, quotes: true }),
        ]);
    })
        .join("\n");
}
exports.renderDatasources = renderDatasources;
function renderGenerators(generators) {
    return generators
        .map(function (generator) {
        var _a, _b, _c;
        return renderBlock("generator", generator.name, [
            renderAttribute("provider", generator.provider.value, { quotes: true }),
            renderAttribute("output", ((_a = generator === null || generator === void 0 ? void 0 : generator.output) === null || _a === void 0 ? void 0 : _a.fromEnvVar)
                ? generator.output.fromEnvVar
                : (_b = generator === null || generator === void 0 ? void 0 : generator.output) === null || _b === void 0 ? void 0 : _b.value, { env: ((_c = generator === null || generator === void 0 ? void 0 : generator.output) === null || _c === void 0 ? void 0 : _c.fromEnvVar) ? true : false, quotes: true }),
            renderAttribute("binaryTargets", generator.binaryTargets.length ? JSON.stringify(generator.binaryTargets) : null),
            renderAttribute("previewFeatures", generator.previewFeatures.length ? JSON.stringify(generator.previewFeatures) : null),
        ]);
    })
        .join("\n");
}
exports.renderGenerators = renderGenerators;
function renderModels(models) {
    return models
        .map(function (model) {
        var _a;
        var items = [];
        // fields
        var fields = model.fields.map(renderField);
        items.push.apply(items, fields);
        //dbname
        if ((_a = model === null || model === void 0 ? void 0 : model.dbName) === null || _a === void 0 ? void 0 : _a.length)
            items.push("@@map(\"".concat(model.dbName, "\")"));
        return renderBlock("model", model.name, items);
    })
        .join("\n");
}
exports.renderModels = renderModels;
function renderEnums(enums) {
    return enums.map(function (_a) {
        var name = _a.name, values = _a.values, dbName = _a.dbName;
        return renderBlock('enum', name, __spreadArray([], values.map(function (_a) {
            var name = _a.name, dbName = _a.dbName;
            var record = name;
            if (dbName && name !== dbName) {
                record = "".concat(record, " @map(\"").concat(dbName, "\")");
            }
            return record;
        }), true));
    }).join('\n');
}
exports.renderEnums = renderEnums;
