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
var helpers_1 = require("../helpers");
describe('combineModels()', function () {
    var baseField = {
        name: 'field1'
    };
    var baseModel = {
        name: 'Test',
        fields: [baseField],
        dbName: '',
        uniqueFields: [],
        uniqueIndexes: [],
        primaryKey: ''
    };
    it('should properly merge models and fields', function () {
        var models = (0, helpers_1.combineModels)([
            baseModel,
            __assign(__assign({}, baseModel), { fields: [
                    baseField,
                    __assign(__assign({}, baseField), { name: 'field2' })
                ] })
        ]);
        var fieldNames = models[0].fields.map(function (field) { return field.name; });
        expect(fieldNames).toEqual(['field1', 'field2']);
    });
});
