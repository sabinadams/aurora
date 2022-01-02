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
 * @returns An object like { User: { firstName: 'first_name' } }
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
        var fieldsWithMappings = pieces
            .slice(1)
            // Clean up new lines and spaces out of the string
            .map(function (field) { return field.replace(/\t/g, '').trim(); })
            // Get rid of any fields that don't even have a @map
            .filter(function (field) { return /\s@map\("(.*)"\)/g.test(field); });
        // Add an index to the reduced array named the model's name
        // The value is an object whose keys are field names and their values are mapping names
        modelDefinitions[pieces[0].split(' ')[1]] = fieldsWithMappings.reduce(function (mappings, field) {
            var _a;
            return (__assign(__assign({}, mappings), (_a = {}, _a[field.trim().split(' ')[0]] = field.split('@map("')[1].split('"')[0], _a)));
        }, {});
        return modelDefinitions;
    }, {});
}
exports.default = default_1;
