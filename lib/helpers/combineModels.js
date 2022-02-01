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
                    var attributes_1 = __spreadArray(__spreadArray([], existing.attributesFixed, true), field.attributesFixed, true);
                    // Combine them and merge attribute options (some data can be lost here)
                    attributes_1 = Array.from(new Set(attributes_1.map(function (attr) {
                        // Get a list of all versions of this attribute
                        var likeAttributes = attributes_1.filter(function (likes) { return attr.attributeType === likes.attributeType; });
                        // Merge (can get rid of some conflicting options)
                        attr = Object.assign.apply(Object, __spreadArray([attr], likeAttributes, false));
                        // We want a string so we can get unique options in a set
                        return JSON.stringify(attr);
                    }))).map(function (attr) { return JSON.parse(attr); }); // Now we can parse that string and get JSON again
                    fields[indexOfExisting].attributesFixed = attributes_1;
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
