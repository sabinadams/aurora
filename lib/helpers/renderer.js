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
function renderBlock(type, name, items) {
    return "".concat(type, " ").concat(name, " {\n").concat(items
        .filter(function (item) { return item.length >= 1; })
        .map(function (item) { return "\t".concat(item); })
        .join('\n'), "\n}");
}
function renderAttribute(name, value, options) {
    if (options === void 0) { options = {
        env: false,
        quotes: false
    }; }
    if (!(value === null || value === void 0 ? void 0 : value.length))
        return '';
    if ((options === null || options === void 0 ? void 0 : options.quotes) || (options === null || options === void 0 ? void 0 : options.env))
        value = "\"".concat(value, "\"");
    if (options === null || options === void 0 ? void 0 : options.env)
        value = "env(".concat(value, ")");
    return "".concat(name, " = ").concat(value);
}
function renderConfigFields(fields) {
    return (Object.keys(fields)
        .filter(function (key) { return key !== 'name'; })
        .filter(function (key) { return fields[key]; })
        .map(function (field) {
        var value = '';
        var isEnvVar = false;
        if (typeof fields[field] == 'string') {
            value = fields[field];
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
        }
        else {
            isEnvVar = fields[field].fromEnvVar ? true : false;
            value = isEnvVar ? fields[field].fromEnvVar : fields[field].value;
        }
        return renderAttribute(field, value, {
            env: isEnvVar,
            quotes: !isEnvVar && !Array.isArray(fields[field])
        });
    }));
}
function renderDatasources(datasources) {
    return datasources
        .map(function (datasource) {
        datasource['provider'] = datasource.activeProvider;
        delete datasource['activeProvider'];
        return renderBlock('datasource', datasource.name, renderConfigFields(datasource));
    })
        .join('\n');
}
exports.renderDatasources = renderDatasources;
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
function renderModels(models) {
    return models
        .map(function (model) {
        var items = model.extendedFields.map(renderModelField);
        items.push.apply(items, model.extendedModelAttributes);
        return renderBlock('model', model.name, items);
    })
        .join('\n');
}
exports.renderModels = renderModels;
function renderEnums(enums) {
    return enums
        .map(function (_a) {
        var name = _a.name, values = _a.values;
        return renderBlock('enum', name, values.map(function (_a) {
            var name = _a.name, dbName = _a.dbName;
            var record = name;
            if (dbName && name !== dbName) {
                record = "".concat(record, " @map(\"").concat(dbName, "\")");
            }
            return record;
        }));
    })
        .join('\n');
}
exports.renderEnums = renderEnums;
