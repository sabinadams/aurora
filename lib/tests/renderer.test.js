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
describe('Renderer Functions', function () {
    describe('renderDatasources()', function () {
        var datasourceString = (0, renderer_1.renderDatasources)([
            {
                activeProvider: 'sqlite',
                name: 'db',
                url: {
                    fromEnvVar: '',
                    value: 'test'
                }
            },
            {
                activeProvider: 'sqlite',
                name: 'db2',
                url: {
                    fromEnvVar: 'DATABASE_URL',
                    value: ''
                }
            }
        ]);
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
        var generatorString = (0, renderer_1.renderGenerators)([
            {
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
            },
            {
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
            }
        ]);
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
    // describe('renderModels()', () => {
    //   const baseModel = {
    //     fields: [],
    //     uniqueFields: [],
    //     dbName: '',
    //     idFields: null,
    //     primaryKey: null,
    //     name: 'Tester'
    //   };
    //   const baseField = {
    //     name: 'id',
    //     kind: 'scalar',
    //     type: 'Int',
    //     isList: false,
    //     isRequired: true,
    //     isId: false,
    //     isUnique: false,
    //     isUpdatedAt: false,
    //     columnName: '',
    //     hasDefaultValue: false,
    //     relationName: '',
    //     relationFromFields: ['id'],
    //     relationToFields: ['otherId']
    //   };
    //   it('should render a model', () => {
    //     const modelString = renderModels([baseModel] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('model Tester');
    //   });
    //   it('should render an @@index', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [baseField],
    //         indexes: [
    //           {
    //             name: 'test',
    //             fields: ['id', 'firstName']
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('@@index(name: "test", [id, firstName])');
    //   });
    //   it('should render a field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [baseField]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int');
    //   });
    //   it('should render a field mapping', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             columnName: 'something'
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @map("something")');
    //   });
    //   it('should signify an optional field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             isRequired: false
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int?');
    //   });
    //   it('should signify a list field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             isList: true
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int[]');
    //   });
    //   it('should signify an id field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             isId: true
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @id');
    //   });
    //   it('should signify an unique field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             isUnique: true
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @unique');
    //   });
    //   it('should signify an updatedAt field', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             isUpdatedAt: true
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @updatedAt');
    //   });
    //   it('should generate a table field name mapping where', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             columnName: 'TestUpdated'
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @map("TestUpdated")');
    //   });
    //   it('should generate a table field with default numeric value', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             hasDefaultValue: true,
    //             default: 0
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @default(0)');
    //   });
    //   it('should generate a table field with quoted default value if non-number', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             hasDefaultValue: true,
    //             default: 'test'
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @default("test")');
    //   });
    //   it('should generate a table field default as a function with params if an object provided', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             hasDefaultValue: true,
    //             default: {
    //               name: 'autoincrement',
    //               args: ['2']
    //             }
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @default(autoincrement(2))');
    //   });
    //   it('should generate a table field relation with to/from attributes if provided', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             relationName: 'PostToUser'
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain(
    //       'id Int @relation(name: "PostToUser", fields: [id], references: [otherId])'
    //     );
    //   });
    //   it('should generate a table field relation with just a name if provided', () => {
    //     const modelString = renderModels([
    //       {
    //         ...baseModel,
    //         fields: [
    //           {
    //             ...baseField,
    //             relationName: 'PostToUser',
    //             relationFromFields: [],
    //             relationToFields: []
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int @relation(name: "PostToUser")');
    //   });
    //   it('should be able to generate multiple models', () => {
    //     const modelString = renderModels([
    //       baseModel,
    //       {
    //         ...baseModel,
    //         name: 'Second'
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('model Tester');
    //     expect(modelString).toContain('model Second');
    //   });
    //   it('should be able to generate multiple fields', () => {
    //     const modelString = renderModels([
    //       baseModel,
    //       {
    //         ...baseModel,
    //         fields: [
    //           baseField,
    //           {
    //             ...baseField,
    //             name: 'otherId'
    //           }
    //         ]
    //       }
    //     ] as unknown as DMMF.Model[]);
    //     expect(modelString).toContain('id Int');
    //     expect(modelString).toContain('otherId Int');
    //   });
    // });
    describe('renderEnums()', function () {
        var baseField = {
            name: 'ROLE',
            dbName: ''
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
        it("should render an enum's records", function () {
            var enumString = (0, renderer_1.renderEnums)([baseEnum]);
            expect(enumString).toContain('ROLE');
        });
        it("should render an enum's record mappings if provided", function () {
            var enumString = (0, renderer_1.renderEnums)([
                __assign(__assign({}, baseEnum), { values: [
                        __assign(__assign({}, baseField), { dbName: 'dbMap' })
                    ] })
            ]);
            expect(enumString).toContain('ROLE @map("dbMap")');
        });
    });
});
