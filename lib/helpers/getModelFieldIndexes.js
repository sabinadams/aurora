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
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like [{ name: 'firstName_lastName', fields: ['firstName', 'lastName'] }]
 */
function default_1(datamodel) {
    // Split the schema up by the ending of each block and then keep each starting with 'model'
    // This should essentially give us an array of the model blocks
    var modelChunks = datamodel.split('}').filter(function (chunk) { return chunk.trim().indexOf('model') === 0; });
    return modelChunks.reduce(function (modelDefinitions, modelChunk) {
        // Split the model chunk by line to get the individual fields
        // The first line will have a model name which we will pull out later
        var pieces = modelChunk.split('\n').filter(function (chunk) { return chunk.trim().length; });
        // Get all of the model's fields out that have the @map attribute
        var fieldsWithIndexes = pieces.slice(1)
            // Clean up new lines and spaces out of the string
            .map(function (field) { return field.replace(/\t/g, '').trim(); })
            // Get rid of any fields that don't even have a @map
            .filter(function (field) { return /@@index\((.*)\)/g.test(field); });
        // Add an index to the reduced array named the model's name
        // The value is an object whose keys are field names and their values are mapping names
        modelDefinitions[pieces[0].split(' ')[1]] = fieldsWithIndexes.reduce(function (indexes, field) { return (__spreadArray(__spreadArray([], indexes, true), [
            {
                name: field.split('"')[1] || null,
                fields: field.split('[')[1].split(']')[0].split(',').map(function (indexField) { return indexField.trim(); })
            }
        ], false)); }, []);
        return modelDefinitions;
    }, {});
}
exports.default = default_1;
