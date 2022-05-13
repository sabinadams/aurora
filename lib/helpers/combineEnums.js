"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineEnums = void 0;
function combineEnums(rawEnums) {
    var enums = rawEnums.reduce(function (acc, curr) {
        if (acc[curr.name]) {
            acc[curr.name].values = acc[curr.name].values.reduce(function (values, field) {
                if (!values.map(function (field) { return field.name; }).includes(field.name)) {
                    values.push(field);
                }
                return values;
            }, curr.values);
        }
        else {
            acc[curr.name] = curr;
        }
        return acc;
    }, {});
    return Object.values(enums);
}
exports.combineEnums = combineEnums;
