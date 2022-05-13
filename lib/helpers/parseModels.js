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
function default_1(datamodel) {
    var modelChunks = datamodel.split('}').filter(function (chunk) { return chunk.trim().indexOf('model') === 0; });
    return modelChunks.reduce(function (modelDefinitions, modelChunk) {
        var _a;
        var pieces = modelChunk.split('\n').filter(function (chunk) { return chunk.trim().length; });
        return __assign(__assign({}, modelDefinitions), (_a = {}, _a[pieces[0].split(' ')[1]] = pieces
            .slice(1)
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
