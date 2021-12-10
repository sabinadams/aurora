import {
  renderDatasources,
  renderEnums,
  renderGenerators,
  renderModels
} from '../helpers/renderer';
import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';

describe('Renderer Functions', () => {
  describe('renderDatasources()', () => {
    const datasourceString = renderDatasources([
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
    ] as DataSource[]);

    it('should generate a valid provider', () => {
      expect(datasourceString).toContain('provider = "sqlite"');
    });
    it('should generate two datasources', () => {
      expect(datasourceString).toContain('datasource db');
      expect(datasourceString).toContain('datasource db2');
    });

    it('should generate a valid url', () => {
      expect(datasourceString).toContain('url = "test"');
    });
    it('should generate a valid env variable', () => {
      expect(datasourceString).toContain('url = env("DATABASE_URL")');
    });
  });

  describe('renderGenerators()', () => {
    const generatorString = renderGenerators([
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
    ] as unknown as GeneratorConfig[]);

    it('should generate two generator blocks', () => {
      expect(generatorString).toContain('generator client');
      expect(generatorString).toContain('generator client2');
    });

    it('should generate a valid output url', () => {
      expect(generatorString).toContain('output = "../../test.prisma"');
    });

    it('should generate a valid output with env var', () => {
      expect(generatorString).toContain('output = env("OUTPUT_PATH")');
    });

    it('should generate binaryTargets when provided', () => {
      expect(generatorString).toContain('binaryTargets = ["binary-target","binary-target-2"]');
    });

    it('should not generate binaryTargets when empty', () => {
      expect((generatorString.match(/binaryTargets/g) || []).length).toBe(1);
    });

    it('should generate previewFeatures when provided', () => {
      expect(generatorString).toContain('previewFeatures = ["preview","preview-2"]');
    });

    it('should not generate previewFeatures when empty', () => {
      expect((generatorString.match(/previewFeatures/g) || []).length).toBe(1);
    });
  });

  describe('renderModels()', () => {
    const baseModel = {
      fields: [],
      uniqueFields: [],
      dbName: '',
      idFields: null,
      primaryKey: null,
      name: 'Tester'
    };
    const baseField = {
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
    it('should render a model', () => {
      const modelString = renderModels([baseModel] as unknown as DMMF.Model[]);
      expect(modelString).toContain('model Tester');
    });

    it('should render a field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [baseField]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int');
    });

    it('should signify an optional field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              isRequired: false
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int?');
    });

    it('should signify a list field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              isList: true
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int[]');
    });

    it('should signify an id field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              isId: true
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @id');
    });

    it('should signify an unique field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              isUnique: true
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @unique');
    });

    it('should signify an updatedAt field', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              isUpdatedAt: true
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @updatedAt');
    });

    it('should generate a table field name mapping where', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              columnName: 'TestUpdated'
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @map("TestUpdated")');
    });

    it('should generate a table field with default numeric value', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              hasDefaultValue: true,
              default: 0
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @default(0)');
    });

    it('should generate a table field with quoted default value if non-number', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              hasDefaultValue: true,
              default: 'test'
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @default("test")');
    });

    it('should generate a table field default as a function with params if an object provided', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              hasDefaultValue: true,
              default: {
                name: 'autoincrement',
                args: ['2']
              }
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @default(autoincrement(2))');
    });

    it('should generate a table field relation with to/from attributes if provided', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              relationName: 'PostToUser'
            }
          ]
        }
      ] as unknown as DMMF.Model[]);

      expect(modelString).toContain(
        'id Int @relation(name: "PostToUser", fields: [id], references: [otherId])'
      );
    });

    it('should generate a table field relation with just a name if provided', () => {
      const modelString = renderModels([
        {
          ...baseModel,
          fields: [
            {
              ...baseField,
              relationName: 'PostToUser',
              relationFromFields: [],
              relationToFields: []
            }
          ]
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('id Int @relation(name: "PostToUser")');
    });

    it('should be able to generate multiple models', () => {
      const modelString = renderModels([
        baseModel,
        {
          ...baseModel,
          name: 'Second'
        }
      ] as unknown as DMMF.Model[]);
      expect(modelString).toContain('model Tester');
      expect(modelString).toContain('model Second');
    });
    it('should be able to generate multiple fields', () => {
      const modelString = renderModels([
        baseModel,
        {
          ...baseModel,
          fields: [
            baseField,
            {
              ...baseField,
              name: 'otherId'
            }
          ]
        }
      ] as unknown as DMMF.Model[]);

      expect(modelString).toContain('id Int');
      expect(modelString).toContain('otherId Int');
    });
  });

  describe('renderEnums()', () => {
    const baseField = {
      name: 'ROLE',
      dbName: ''
    };
    const baseEnum = {
      name: 'TestEnum',
      dbName: '',
      values: [baseField]
    };

    it('should render an enum', () => {
      const enumString = renderEnums([baseEnum] as unknown as DMMF.DatamodelEnum[]);
      expect(enumString).toContain('enum TestEnum');
    });

    it("should render an enum's records", () => {
      const enumString = renderEnums([baseEnum] as unknown as DMMF.DatamodelEnum[]);
      expect(enumString).toContain('ROLE');
    });

    it("should render an enum's record mappings if provided", () => {
      const enumString = renderEnums([
        {
          ...baseEnum,
          values: [
            {
              ...baseField,
              dbName: 'dbMap'
            }
          ]
        }
      ] as unknown as DMMF.DatamodelEnum[]);
      expect(enumString).toContain('ROLE @map("dbMap")');
    });
  });
});
