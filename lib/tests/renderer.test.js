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
var renderer_1 = require("../helpers/renderer");
describe("Renderer Functions", function () {
    describe('renderDatasources()', function () {
        var datasourceString = (0, renderer_1.renderDatasources)([{
                activeProvider: 'sqlite',
                name: 'db',
                url: {
                    fromEnvVar: '',
                    value: 'test'
                }
            }, {
                activeProvider: 'sqlite',
                name: 'db2',
                url: {
                    fromEnvVar: 'DATABASE_URL',
                    value: ''
                }
            }]);
        it('should generate a valid provider', function () {
            expect(datasourceString).toContain('provider = "sqlite"');
        });
        it('should generate two datasources', function () {
            expect(datasourceString).toContain('datasource db');
            expect(datasourceString).toContain('datasource db2');
        });
        it('should generate a valid url', function () {
            expect(datasourceString).toContain('url = "test"');
        });
        it('should generate a valid env variable', function () {
            expect(datasourceString).toContain('url = env("DATABASE_URL")');
        });
    });
    describe('renderGenerators()', function () {
        var generatorString = (0, renderer_1.renderGenerators)([{
                name: 'client',
                provider: {
                    fromEnvVar: '',
                    value: 'test-client'
                },
                output: {
                    fromEnvVar: '',
                    value: '../../test.prisma'
                },
                binaryTargets: ['binary-target', 'binary-target-2'],
                previewFeatures: ['preview', 'preview-2']
            }, {
                name: 'client2',
                provider: {
                    value: 'test'
                },
                output: {
                    fromEnvVar: 'OUTPUT_PATH',
                    value: ''
                },
                binaryTargets: [],
                previewFeatures: []
            }]);
        it('should generate two generator blocks', function () {
            expect(generatorString).toContain('generator client');
            expect(generatorString).toContain('generator client2');
        });
        it('should generate a valid output url', function () {
            expect(generatorString).toContain('output = "../../test.prisma"');
        });
        it('should generate a valid output with env var', function () {
            expect(generatorString).toContain('output = env("OUTPUT_PATH")');
        });
        it('should generate binaryTargets when provided', function () {
            expect(generatorString).toContain('binaryTargets = ["binary-target","binary-target-2"]');
        });
        it('should not generate binaryTargets when empty', function () {
            expect((generatorString.match(/binaryTargets/g) || []).length).toBe(1);
        });
        it('should generate previewFeatures when provided', function () {
            expect(generatorString).toContain('previewFeatures = ["preview","preview-2"]');
        });
        it('should not generate previewFeatures when empty', function () {
            expect((generatorString.match(/previewFeatures/g) || []).length).toBe(1);
        });
    });
    describe('renderModels()', function () {
        var baseModel = {
            fields: [],
            uniqueFields: [],
            dbName: '',
            idFields: null,
            primaryKey: null,
            name: 'Tester'
        };
        var baseField = {
            name: 'id',
            kind: 'scalar',
            type: 'Int',
            isList: false,
            isRequired: true,
            isId: false,
            isUnique: false,
            isUpdatedAt: false,
            columnName: '',
            hasDefaultValue: false,
            relationName: '',
            relationFromFields: ['id'],
            relationToFields: ['otherId']
        };
        it('should render a model', function () {
            var modelString = (0, renderer_1.renderModels)([baseModel]);
            expect(modelString).toContain('model Tester');
        });
        it('should render a field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [baseField] })]);
            expect(modelString).toContain('id Int');
        });
        it('should signify an optional field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { isRequired: false })] })]);
            expect(modelString).toContain('id Int?');
        });
        it('should signify a list field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { isList: true })] })]);
            expect(modelString).toContain('id Int[]');
        });
        it('should signify an id field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { isId: true })] })]);
            expect(modelString).toContain('id Int @id');
        });
        it('should signify an unique field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { isUnique: true })] })]);
            expect(modelString).toContain('id Int @unique');
        });
        it('should signify an updatedAt field', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { isUpdatedAt: true })] })]);
            expect(modelString).toContain('id Int @updatedAt');
        });
        it('should generate a table field name mapping where', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { columnName: 'TestUpdated' })] })]);
            expect(modelString).toContain('id Int @map("TestUpdated")');
        });
        it('should generate a table field with default numeric value', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { hasDefaultValue: true, default: 0 })] })]);
            expect(modelString).toContain('id Int @default(0)');
        });
        it('should generate a table field with quoted default value if non-number', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { hasDefaultValue: true, default: 'test' })] })]);
            expect(modelString).toContain('id Int @default("test")');
        });
        it('should generate a table field default as a function with params if an object provided', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { hasDefaultValue: true, default: {
                                name: 'autoincrement',
                                args: ['2']
                            } })] })]);
            expect(modelString).toContain('id Int @default(autoincrement(2))');
        });
        it('should generate a table field relation with to/from attributes if provided', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { relationName: 'PostToUser' })] })]);
            expect(modelString).toContain('id Int @relation(name: "PostToUser", fields: [id], references: [otherId])');
        });
        it('should generate a table field relation with just a name if provided', function () {
            var modelString = (0, renderer_1.renderModels)([__assign(__assign({}, baseModel), { fields: [__assign(__assign({}, baseField), { relationName: 'PostToUser', relationFromFields: [], relationToFields: [] })] })]);
            expect(modelString).toContain('id Int @relation(name: "PostToUser")');
        });
        it('should be able to generate multiple models', function () {
            var modelString = (0, renderer_1.renderModels)([baseModel, __assign(__assign({}, baseModel), { name: 'Second' })]);
            expect(modelString).toContain('model Tester');
            expect(modelString).toContain('model Second');
        });
        it('should be able to generate multiple fields', function () {
            var modelString = (0, renderer_1.renderModels)([baseModel, __assign(__assign({}, baseModel), { fields: [baseField, __assign(__assign({}, baseField), { name: 'otherId' })] })]);
            expect(modelString).toContain('id Int');
            expect(modelString).toContain('otherId Int');
        });
    });
    describe('renderEnums()', function () {
        var baseField = {
            name: 'ROLE',
            dbName: ""
        };
        var baseEnum = {
            name: 'TestEnum',
            dbName: '',
            values: [baseField]
        };
        it('should render an enum', function () {
            var enumString = (0, renderer_1.renderEnums)([baseEnum]);
            expect(enumString).toContain('enum TestEnum');
        });
        it('should render an enum\'s records', function () {
            var enumString = (0, renderer_1.renderEnums)([baseEnum]);
            expect(enumString).toContain('ROLE');
        });
        it('should render an enum\'s record mappings if provided', function () {
            var enumString = (0, renderer_1.renderEnums)([__assign(__assign({}, baseEnum), { values: [__assign(__assign({}, baseField), { dbName: 'dbMap' })] })]);
            expect(enumString).toContain('ROLE @map("dbMap")');
        });
    });
});
