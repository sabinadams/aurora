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
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEnums = exports.renderModels = exports.renderGenerators = exports.renderDatasources = void 0;
/**
 *
 * @param type Prisma block's type
 * @param name Prisma block's name
 * @param items Block's inner items
 * @returns A generated Prisma Schema block
 */
function renderBlock(type, name, items) {
    return "".concat(type, " ").concat(name, " {\n").concat(items
        .filter(function (item) { return item.length >= 1; })
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
 * @param fields A list of fields from a generator or datasource
 * @returns A rendered attribute block
 */
function renderConfigFields(fields) {
    return (Object.keys(fields)
        // Don't care about the name field
        .filter(function (key) { return key !== 'name'; })
        // Make sure the key isn't null
        .filter(function (key) { return fields[key]; })
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
        return renderBlock('datasource', datasource.name, renderConfigFields(datasource));
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
        return renderBlock('generator', generator.name, renderConfigFields(generator));
    })
        .join('\n');
}
exports.renderGenerators = renderGenerators;
function renderModelField(field) {
    var pieces = [
        field.name,
        "".concat(field.type).concat(field.optional ? '?' : '').concat(field.scalar ? '[]' : ''),
        field.attributes.join(' ')
    ];
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
        var items = model.extendedFields.map(renderModelField);
        items.push.apply(items, model.extendedModelAttributes);
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
