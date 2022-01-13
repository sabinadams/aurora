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
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like [{ name: 'firstName_lastName', fields: ['firstName', 'lastName'] }]
 */
function parseModelFields(models) {
    return Object.keys(models).reduce(function (acc, curr) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[curr] = models[curr].map(function (field) {
            field.attributes = field.attributes
                .map(function (attribute) {
                var getMatchIndices = function (regex, str) {
                    var result = [];
                    var match;
                    regex = new RegExp(regex);
                    while ((match = regex.exec(str)))
                        result.push(match.index);
                    return result;
                };
                var indices = getMatchIndices(/[^@]@/g, attribute);
                indices.forEach(function (index) {
                    attribute = attribute.slice(0, index + 1) + ' ' + attribute.slice(index + 1);
                });
                return attribute.split(' ');
            })
                .flat();
            field.attributesFixed = field.attributes.map(function (attribute) {
                var attributeObject = {
                    default: null,
                    fields: null,
                    references: null,
                    map: null,
                    name: null,
                    attributeType: '',
                    value: null,
                    length: null,
                    sort: null,
                    onUpdate: null,
                    onDelete: null
                };
                attributeObject.attributeType =
                    attribute.indexOf('(') > -1 ? attribute.split('(')[0] : attribute;
                if (attribute.indexOf('[') > -1 && attribute.indexOf('fields:') == -1) {
                    attributeObject.fields = attribute.split('[')[1].split(']')[0].split(',');
                }
                if (attribute.indexOf('fields:') > -1) {
                    attributeObject.fields = attribute
                        .split('fields:')[1]
                        .split('[')[1]
                        .split(']')[0]
                        .split(',');
                    attribute = attribute
                        .replace("fields: [".concat(attributeObject.fields.join(', '), "]"), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('references:') > -1) {
                    attributeObject.references = attribute
                        .split('references:')[1]
                        .split('[')[1]
                        .split(']')[0]
                        .split(',');
                    attribute = attribute
                        .replace("references: [".concat(attributeObject.references.join(', '), "]"), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('name:') > -1) {
                    attributeObject.name = attribute.split('name:')[1].split('"')[1].trim();
                    attribute = attribute
                        .replace("name:\"".concat(attributeObject.name, "\""), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('map:') > -1) {
                    attributeObject.map = attribute.split('map:')[1].split('"')[1].trim();
                    attribute = attribute
                        .replace("map:\"".concat(attributeObject.map, "\""), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('length:') > -1) {
                    attributeObject.length = attribute.split('length:')[1].split(',')[0].split(')')[0];
                    attribute = attribute
                        .replace("length: ".concat(attributeObject.length), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('sort:') > -1) {
                    attributeObject.sort = attribute.split('sort:')[1].split(',')[0].split(')')[0];
                    attribute = attribute
                        .replace("sort: ".concat(attributeObject.sort), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('onUpdate:') > -1) {
                    attributeObject.onUpdate = attribute.split('onUpdate:')[1].split(',')[0].split(')')[0];
                    attribute = attribute
                        .replace("onUpdate: ".concat(attributeObject.onUpdate), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('onDelete:') > -1) {
                    attributeObject.onDelete = attribute.split('onDelete:')[1].split(',')[0].split(')')[0];
                    attribute = attribute
                        .replace("onDelete: ".concat(attributeObject.onDelete), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attribute.indexOf('value:') > -1) {
                    attributeObject.value = attribute.split('value:')[1].split(',')[0].split(')')[0];
                    attribute = attribute
                        .replace("value:".concat(attributeObject.value), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attributeObject.attributeType !== '@default' &&
                    attribute.indexOf('(') > -1 &&
                    attribute.split('(')[1].charAt(0) == '"') {
                    attributeObject.name = attribute.split('("')[1].split('")')[0];
                    attribute = attribute
                        .replace("".concat(attributeObject.attributeType, "(\"").concat(attributeObject.name, "\")"), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                if (attributeObject.attributeType === '@default' && !attributeObject.default) {
                    attributeObject.default = attribute.split('default(')[1].slice(0, -1);
                    attribute = attribute
                        .replace("@default(".concat(attributeObject.default, ")"), '')
                        .split(',')
                        .map(function (chunk) { return chunk.trim(); })
                        .join('');
                }
                return attributeObject;
            });
            return field;
        }), _a)));
    }, {});
}
exports.default = parseModelFields;
