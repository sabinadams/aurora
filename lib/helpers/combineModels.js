"use strict";
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
