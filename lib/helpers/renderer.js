"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEnums = exports.renderModels = exports.renderGenerators = exports.renderDatasources = void 0;
var CONSTANTS_1 = require("../util/CONSTANTS");
/**
 *
 * @param type Prisma block's type
 * @param name Prisma block's name
 * @param items Block's inner items
 * @returns A generated Prisma Schema block
 */
function renderBlock(type, name, items) {
    return "".concat(type, " ").concat(name, " {\n").concat(items
        .filter(function (item) { return item.length > 1; })
        .map(function (item) { return "\t".concat(item); })
        .join("\n"), "\n}");
}
/**
 *
 * @param name Name of the attribute
 * @param value Value of the attribute
 * @param options Options defining whether or not to wrap the value in quotes and/or env()
 * @returns A generated attribute line (e.g. output = "/some/location/schema.prisma")
 */
function renderAttribute(name, value, options) {
    if (options === void 0) { options = {
        env: false,
        quotes: false,
    }; }
    // If we don't have a value, don't generate a line
    if (!(value === null || value === void 0 ? void 0 : value.length))
        return "";
    // Optionally wrap the value in quotes
    if ((options === null || options === void 0 ? void 0 : options.quotes) || (options === null || options === void 0 ? void 0 : options.env))
        value = "\"".concat(value, "\"");
    // Handle scenario where value comes from the environment
    if (options === null || options === void 0 ? void 0 : options.env)
        value = "env(".concat(value, ")");
    return "".concat(name, " = ").concat(value);
}
/**
 *
 * @param field The Prisma Field we are generating the relation line for
 * @returns the Relation definition (e.g. @relation(name: "PostToUser"))
 */
function renderFieldRelation(field) {
    return field.relationFromFields.length > 0
        ? "@relation(name: \"".concat(field.relationName, "\", fields: [").concat(field.relationFromFields, "], references: [").concat(field.relationToFields, "])")
        : "@relation(name: \"".concat(field.relationName, "\")");
}
/**
 *
 * @param field The Prisma Field with a default attribute
 * @returns the Default definition (e.g. @default(autoincrement()))
 */
function renderDefaultAttribute(field) {
    // If the default value isn't available, do nothing
    if (field.default == null || field.default === undefined)
        return "";
    var defaultString;
    // We've got ourselves a function! Handle it properly
    if (typeof field.default === "object") {
        defaultString = "".concat(field.default.name, "(").concat(field.default.args, ")");
    }
    // This is a normal value.
    else {
        defaultString = field === null || field === void 0 ? void 0 : field.default;
        // If this is a value that should be wrapped in quotes, do so
        if (field.kind === "scalar" &&
            field.type !== "BigInt" &&
            typeof field.default == "string")
            defaultString = "\"".concat(defaultString, "\"");
    }
    return "@default(".concat(defaultString, ")");
}
/**
 *
 * @param field The Prisma Field we are generating a line
 * @returns The generated Field line for a Model block
 */
function renderField(field) {
    var _a;
    // If the field's "kind" isn't valid, throw error
    if (!CONSTANTS_1.VALID_FIELD_KINDS.includes(field.kind))
        throw new Error("Unsupported field kind \"".concat(field.kind, "\""));
    // Initialize the line with the field name and type
    var fieldString = "".concat(field.name, " ").concat(field.type);
    // If this is a list field, signify that on the line
    if (field.isList)
        fieldString = "".concat(fieldString, "[]");
    // If this is not a list field, and it isn't required or it is an enum/object, signify that it is optional in the line
    else if (!field.isRequired || ["enum", "object"].includes(field.kind))
        fieldString = "".concat(fieldString, "?");
    // The remaining field attributes are self-explanatory
    if (field.isId)
        fieldString = "".concat(fieldString, " @id");
    if (field.isUnique)
        fieldString = "".concat(fieldString, " @unique");
    if (field.isUpdatedAt)
        fieldString = "".concat(fieldString, " @updatedAt");
    if ((_a = field === null || field === void 0 ? void 0 : field.columnName) === null || _a === void 0 ? void 0 : _a.length)
        fieldString = "".concat(fieldString, " @map(\"").concat(field.columnName, "\")");
    if (field.hasDefaultValue)
        fieldString = "".concat(fieldString, " ").concat(renderDefaultAttribute(field));
    if (field.relationName)
        fieldString = "".concat(fieldString, " ").concat(renderFieldRelation(field));
    return fieldString;
}
/**
 *
 * @param uniqueField Array of Arrays that hold the field names for the unique field
 * @returns The generated Unique line for a model (e.g. @@unique([id, otherId])) )
 */
function renderUniqueField(uniqueField) {
    return "@@unique([".concat(uniqueField.join(', '), "])");
}
/**
 *
 * @param fields Fields in the ID definition
 * @returns The generated ID definition for a model. (e.g. @@id([id, otherId]))
 */
function renderIdOrPk(fields) {
    return fields.length ? "@@id([".concat(fields.join(', '), "])") : '';
}
/**
 *
 * @param datasources A list of Prisma Datasources
 * @returns string with rendered Datasource Blocks
 */
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
/**
 *
 * @param generators A list of Prisma Generators
 * @returns string with rendered Generator Blocks
 */
function renderGenerators(generators) {
    return generators
        .map(function (generator) {
        var _a, _b, _c;
        return renderBlock("generator", generator.name, [
            renderAttribute("provider", generator.provider.value, { quotes: true }),
            renderAttribute("output", ((_a = generator === null || generator === void 0 ? void 0 : generator.output) === null || _a === void 0 ? void 0 : _a.fromEnvVar)
                ? generator.output.fromEnvVar
                : (_b = generator === null || generator === void 0 ? void 0 : generator.output) === null || _b === void 0 ? void 0 : _b.value, { env: ((_c = generator === null || generator === void 0 ? void 0 : generator.output) === null || _c === void 0 ? void 0 : _c.fromEnvVar) ? true : false, quotes: true }),
            renderAttribute("binaryTargets", generator.binaryTargets.length
                ? JSON.stringify(generator.binaryTargets)
                : null),
            renderAttribute("previewFeatures", generator.previewFeatures.length
                ? JSON.stringify(generator.previewFeatures)
                : null),
        ]);
    })
        .join("\n");
}
exports.renderGenerators = renderGenerators;
/**
 *
 * @param models A list of Prisma Models
 * @returns string with rendered Model Blocks
 */
function renderModels(models) {
    // Need to also render unique fields
    return models
        .map(function (model) {
        var _a, _b;
        var items = model.fields.map(renderField);
        // Unique fields
        items.push.apply(items, model.uniqueFields.map(renderUniqueField));
        // If there is a table name mapping, add it
        if ((_a = model === null || model === void 0 ? void 0 : model.dbName) === null || _a === void 0 ? void 0 : _a.length)
            items.push("@@map(\"".concat(model.dbName, "\")"));
        // ID/PK  ( idFields is backwards compatibility for prisma versions below v.2.30.0)
        if (model.idFields || model.primaryKey)
            items.push(renderIdOrPk((model === null || model === void 0 ? void 0 : model.idFields) || ((_b = model === null || model === void 0 ? void 0 : model.primaryKey) === null || _b === void 0 ? void 0 : _b.fields)));
        return renderBlock("model", model.name, items);
    })
        .join("\n");
}
exports.renderModels = renderModels;
/**
 *
 * @param enums A list of Prisma Enums
 * @returns string with rendered Enum Blocks
 */
function renderEnums(enums) {
    return enums
        .map(function (_a) {
        var name = _a.name, values = _a.values;
        return renderBlock("enum", name, values.map(function (_a) {
            var name = _a.name, dbName = _a.dbName;
            var record = name;
            // If there is a name mapping, add it
            if (dbName && name !== dbName) {
                record = "".concat(record, " @map(\"").concat(dbName, "\")");
            }
            return record;
        }));
    })
        .join("\n");
}
exports.renderEnums = renderEnums;
