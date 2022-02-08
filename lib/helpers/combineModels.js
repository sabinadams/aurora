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
/**
 *
 * @param rawModels A list of Prisma models to combine in a way that doesn't duplicate fields
 * @returns A list of Prisma Models
 */
function combineModels(rawModels) {
    var models = rawModels.reduce(function (acc, curr) {
        // If we already saw this model
        if (acc[curr.name]) {
            // Merge the fields arrays starting with the current model's fields as the source
            acc[curr.name].extendedFields = acc[curr.name].extendedFields.reduce(function (fields, field) {
                // If we don't already have this field
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                else {
                    var indexOfExisting = fields.findIndex(function (existingField) { return existingField.name === field.name; });
                    var existing = fields.find(function (existingField) { return existingField.name === field.name; });
                    // Combine the attributes
                    fields[indexOfExisting].attributes = Array.from(new Set(__spreadArray(__spreadArray([], fields[indexOfExisting].attributes, true), field.attributes, true)));
                    // Get a list of all of the old and new
                    var attributes = __spreadArray(__spreadArray([], existing.attributes, true), field.attributes, true);
                    fields[indexOfExisting].attributesFixed = attributes;
                }
                return fields;
            }, curr.extendedFields);
            acc[curr.name].extendedModelAttributes = acc[curr.name].extendedModelAttributes.reduce(function (fields, field) {
                // If we don't already have this field
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                return fields;
            }, curr.extendedModelAttributes);
            acc[curr.name].fields = acc[curr.name].fields.reduce(function (fields, field) {
                // If we don't already have this field
                if (!fields.map(function (field) { return field.name; }).includes(field.name)) {
                    fields.push(field);
                }
                return fields;
            }, curr.fields);
        }
        else {
            // Add the model to our record
            acc[curr.name] = curr;
        }
        return acc;
    }, {});
    return Object.values(models);
}
exports.combineModels = combineModels;
