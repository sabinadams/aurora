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
        .join('\n'), "\n}");
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
        quotes: false
    }; }
    // If we don't have a value, don't generate a line
    if (!(value === null || value === void 0 ? void 0 : value.length))
        return '';
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
    return field.relationFromFields && field.relationFromFields.length > 0
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
        return '';
    var defaultString;
    // We've got ourselves a function! Handle it properly
    if (typeof field.default === 'object') {
        defaultString = "".concat(field.default.name, "(").concat(field.default.args, ")");
    }
    // This is a normal value.
    else {
        defaultString = field === null || field === void 0 ? void 0 : field.default;
        // If this is a value that should be wrapped in quotes, do so
        if (field.kind === 'scalar' && field.type !== 'BigInt' && typeof field.default == 'string')
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
    else if (!field.isRequired || ['enum', 'object'].includes(field.kind))
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
 * @param uniqueField Array of strings that hold the field names for the unique field
 * @returns The generated Unique line for a model (e.g. @@unique([id, otherId])) )
 */
function renderUniqueField(uniqueField) {
    return "@@unique([".concat(uniqueField.join(', '), "])");
}
/**
 *
 * @param indexes Array of strings that hold the field names the indexed fields
 * @returns The generated index line for a model (e.g. @@index([someId, otherId])) )
 */
function renderIndex(index) {
    var _a;
    return ((_a = index === null || index === void 0 ? void 0 : index.name) === null || _a === void 0 ? void 0 : _a.length)
        ? "@@index(name: \"".concat(index.name, "\", [").concat(index.fields.join(', '), "])")
        : "@@index([".concat(index.fields.join(', '), "])");
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
 * @param fields A list of fields from a generator or datasource
 * @returns A rendered attribute block
 */
function renderConfigFields(fields, renderable) {
    return (Object.keys(fields)
        // Don't care about the name field
        .filter(function (key) { return key !== 'name'; })
        // Make sure the key isn't null
        .filter(function (key) { return fields[key]; })
        // Make sure this field is in the list of renderable fields
        .filter(function (key) { return renderable.includes(key); })
        .map(function (field) {
        var value = '';
        var isEnvVar = false;
        // If it's a string, that should be our value
        if (typeof fields[field] == 'string') {
            value = fields[field];
            // If it's an array, go through the array
        }
        else if (Array.isArray(fields[field]) && fields[field].length) {
            value = "[".concat(fields[field]
                .map(function (val) {
                var fieldIsEnvVar = false;
                if (typeof val == 'string') {
                    val = "\"".concat(val, "\"");
                }
                else {
                    fieldIsEnvVar = val.fromEnvVar ? true : false;
                    val = fieldIsEnvVar ? "env(\"".concat(val.fromEnvVar, "\")") : "\"".concat(val.value, "\"");
                }
                return val;
            })
                .join(','), "]");
            // It must be an env var object. Get the data
        }
        else {
            isEnvVar = fields[field].fromEnvVar ? true : false;
            value = isEnvVar ? fields[field].fromEnvVar : fields[field].value;
        }
        // Render the attribute and return it
        return renderAttribute(field, value, {
            env: isEnvVar,
            quotes: !isEnvVar && !Array.isArray(fields[field])
        });
    }));
}
/**
 *
 * @param datasources A list of Prisma Datasources
 * @returns string with rendered Datasource Blocks
 */
function renderDatasources(datasources) {
    return datasources
        .map(function (datasource) {
        // Fix naming differences
        datasource['provider'] = datasource.activeProvider;
        // Render the block
        return renderBlock('datasource', datasource.name, renderConfigFields(datasource, CONSTANTS_1.DATASOURCE_FIELDS));
    })
        .join('\n');
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
        generator = __assign(__assign({}, generator), generator.config);
        return renderBlock('generator', generator.name, renderConfigFields(generator, CONSTANTS_1.GENERATOR_FIELDS));
    })
        .join('\n');
}
exports.renderGenerators = renderGenerators;
function renderModelAttribute(attribute) {
    var pieces = [
        "".concat(attribute.attributeType, "("),
        __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (attribute.default ? [attribute.default] : []), true), (attribute.name ? ["name:\"".concat(attribute.name, "\"")] : []), true), (attribute.map ? ["map:\"".concat(attribute.map, "\"")] : []), true), (attribute.sort ? ["sort:".concat(attribute.sort)] : []), true), (attribute.onDelete ? ["onDelete: ".concat(attribute.onDelete)] : []), true), (attribute.onUpdate ? ["onUpdate: ".concat(attribute.onUpdate)] : []), true), (attribute.value ? ["value:".concat(attribute.value)] : []), true), (attribute.length ? ["length: ".concat(attribute.length)] : []), true), (attribute.fields ? ["fields: [".concat(attribute.fields.join(','), "]")] : []), true), (attribute.references ? ["references: [".concat(attribute.references.join(','), "]")] : []), true).filter(function (chunk) { return chunk.length; })
            .join(', '),
        ')'
    ];
    return pieces.join('');
}
function renderModelField(field) {
    var pieces = __spreadArray([
        field.name,
        "".concat(field.type).concat(field.optional ? '?' : '').concat(field.scalar ? '[]' : '')
    ], field.attributesFixed.map(renderModelAttribute), true);
    return pieces.join(' ');
}
/**
 *
 * @param models A list of Prisma Models
 * @returns string with rendered Model Blocks
 */
function renderModels(models) {
    // Need to also render unique fields
    return models
        .map(function (model) {
        // console.dir(model.extendedFields, { depth: 3})
        var items = model.extendedFields.map(renderModelField);
        // Render Attribute blocks (data retrieved from custom parser because Prisma's DMMF doesn't provide all the data we need)
        var modelAttrs = model.extendedModelAttributes
            .map(function (attr) { return attr.attributesFixed; })
            .flat(2);
        items.push.apply(items, modelAttrs.map(function (attribute) { return renderModelAttribute(attribute); }));
        return renderBlock('model', model.name, items);
    })
        .join('\n');
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
        return renderBlock('enum', name, values.map(function (_a) {
            var name = _a.name, dbName = _a.dbName;
            var record = name;
            // If there is a name mapping, add it
            if (dbName && name !== dbName) {
                record = "".concat(record, " @map(\"").concat(dbName, "\")");
            }
            return record;
        }));
    })
        .join('\n');
}
exports.renderEnums = renderEnums;
