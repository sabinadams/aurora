"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseDatasourceFields(blockName, lines) {
    return lines.map(function (line) {
        var lineData = {
            blockName: blockName,
            name: '',
            value: { fromEnvVar: '', value: '' }
        };
        var _a = line.split(' = '), name = _a[0], value = _a[1];
        lineData['name'] = name;
        if (value.indexOf('env(') > -1) {
            lineData['value'] = {
                fromEnvVar: value.split('env(')[1].split(')')[0].split('"')[1],
                value: ''
            };
        }
        else {
            lineData['value'] = {
                fromEnvVar: null,
                value: value.indexOf('[')
                    ? value.split('[')[1].split(']')[0].split(',')
                    : value.split('"')[1]
            };
        }
        return lineData;
    });
}
exports.default = parseDatasourceFields;
