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
            return field;
        }), _a)));
    }, {});
}
exports.default = parseModelFields;
