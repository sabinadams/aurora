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
exports.combineModels = void 0;
function combineModels(rawModels) {
    var models = rawModels.reduce(function (acc, curr) {
        if (acc[curr.name]) {
            acc[curr.name].extendedFields = acc[curr.name].extendedFields.reduce(function (fields, field) {
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                else {
                    var indexOfExisting = fields.findIndex(function (existingField) { return existingField.name === field.name; });
                    var existing = fields.find(function (existingField) { return existingField.name === field.name; });
                    fields[indexOfExisting].attributes = Array.from(new Set(__spreadArray(__spreadArray([], fields[indexOfExisting].attributes, true), field.attributes, true)));
                    var attributes = __spreadArray(__spreadArray([], existing.attributes, true), field.attributes, true);
                    fields[indexOfExisting].attributesFixed = attributes;
                }
                return fields;
            }, curr.extendedFields);
            acc[curr.name].extendedModelAttributes = acc[curr.name].extendedModelAttributes.reduce(function (fields, field) {
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                return fields;
            }, curr.extendedModelAttributes);
            acc[curr.name].fields = acc[curr.name].fields.reduce(function (fields, field) {
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                return fields;
            }, curr.fields);
        }
        else {
            acc[curr.name] = curr;
        }
        return acc;
    }, {});
    return Object.values(models);
}
exports.combineModels = combineModels;
