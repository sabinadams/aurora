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
 * @returns An object like:
 * ```json
 * { "Person": [ { name: 'id', type: 'int', attributes: ['@id'], isModelAttribute: false, isFieldAttribute: true } ] }
 * ```
 */
function default_1(datamodel) {
    // Split the schema up by the ending of each block and then keep each starting with 'model'
    // This should essentially give us an array of the model blocks
    var modelChunks = datamodel.split('}').filter(function (chunk) { return chunk.trim().indexOf('model') === 0; });
    return modelChunks.reduce(function (modelDefinitions, modelChunk) {
        var _a;
        // Split the model chunk by line to get the individual fields
        // The first line will have a model name which we will pull out later
        var pieces = modelChunk.split('\n').filter(function (chunk) { return chunk.trim().length; });
        return __assign(__assign({}, modelDefinitions), (_a = {}, _a[pieces[0].split(' ')[1]] = pieces
            // Don't need the name
            .slice(1)
            // Clean up new lines and spaces out of the string
            .map(function (field) {
            var _a = field
                .trim()
                .replace(/\t/g, '')
                .replace(/:\s/g, ':')
                .replace(/,\s/g, ',')
                .replace(/\s+/g, ' ')
                .split(' '), name = _a[0], type = _a[1], attributes = _a.slice(2);
            var isModelAttribute = name.includes('@@');
            return {
                name: isModelAttribute ? null : name,
                type: isModelAttribute ? null : type.replace('?', '').replace('[]', ''),
                optional: isModelAttribute ? null : type.indexOf('?') > -1,
                scalar: isModelAttribute ? null : type.indexOf('[]') > -1,
                attributes: isModelAttribute ? [name] : __spreadArray([], attributes, true),
                isModelAttribute: isModelAttribute,
                isFieldAttribute: !isModelAttribute
            };
        }), _a));
    }, {});
}
exports.default = default_1;
