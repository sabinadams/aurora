"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineEnums = void 0;
/**
 *
 * @param rawEnums A list of Prisma models to combine in a way that doesn't duplicate fields
 * @returns A list of Prisma Models
 */
function combineEnums(rawEnums) {
    var enums = rawEnums.reduce(function (acc, curr) {
        // If we already saw this model
        if (acc[curr.name]) {
            acc[curr.name].values = acc[curr.name].values.reduce(function (values, field) {
                // If we don't already have this field
                if (!values.map(function (field) { return field.name; }).includes(field.name)) {
                    values.push(field);
                }
                return values;
            }, curr.values);
        }
        else {
            // Add the model to our record
            acc[curr.name] = curr;
        }
        return acc;
    }, {});
    return Object.values(enums);
}
exports.combineEnums = combineEnums;
