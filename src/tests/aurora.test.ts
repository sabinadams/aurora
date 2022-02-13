import mockConfigFetcher from './helpers/mockConfigFetcher';
import * as helpers from '../helpers';
import aurora from '../aurora';
import { spyOn } from 'jest-mock';

async function getGeneratedSchema(paths: string[]) {
  mockConfigFetcher(paths);
  await aurora();
  return jest.spyOn(helpers, 'writeSchema').mock.calls[0][1].replace(/\s+/g, ' ');
}

describe('aurora()', () => {
  beforeAll(() => {
    process.env.DATABASE_URL = 'file:./dev.db';
    process.env.SHADOW_DATABASE_URL = 'file:./shadow.db';
    process.env.BINARY_TARGETS = 'native';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Datasource Blocks', () => {
    it('should render datasource name', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/datasource/datasource-url.prisma'
      ]);
      expect(generatedSchema).toContain('datasource db');
    });

    it('should render provider', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/datasource/datasource-url.prisma'
      ]);
      expect(generatedSchema).toContain('provider = "sqlite"');
    });

    it('should render url', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/datasource/datasource-url.prisma'
      ]);
      expect(generatedSchema).toContain('url = "file:./dev.db"');
    });

    it('should render shadowDatabaseUrl', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/datasource/datasource-url.prisma'
      ]);
      expect(generatedSchema).toContain('shadowDatabaseUrl = "file:./shadow.db"');
    });

    it('should render referentialIntegrity', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/datasource/datasource-url.prisma'
      ]);
      expect(generatedSchema).toContain('referentialIntegrity = "prisma"');
    });

    it('should env var in url', async () => {
      const generatedSchemaWithEnv = await getGeneratedSchema([
        'feature-specific/datasource/datasource-env-url.prisma'
      ]);
      expect(generatedSchemaWithEnv).toContain('url = env("DATABASE_URL")');
    });

    it('should render env var in shadowDatabaseUrl', async () => {
      const generatedSchemaWithEnv = await getGeneratedSchema([
        'feature-specific/datasource/datasource-env-url.prisma'
      ]);
      expect(generatedSchemaWithEnv).toContain('shadowDatabaseUrl = env("SHADOW_DATABASE_URL")');
    });
  });

  describe('Generator Blocks', () => {
    it('should succeed when no generators are present', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/noGenerators.prisma'
      ]);

      expect(generatedSchema).not.toContain('generator');
    });

    it('Should succeed when there are multiple generators present', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/multipleGenerators.prisma'
      ]);
      // count all the generator statements which look like this:
      // generator_SOMENAME_{...
      const count = (generatedSchema.match(/generator\s+\w+\s+\{/g) || []).length;
      expect(count).toBe(2);
    });

    it('should render generator name', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('generator client');
    });

    it('should render generator provider', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('provider = "prisma-client-js"');
    });

    it('should render generator output', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('output = "../src/generated"');
    });

    it('should render generator previewFeatures', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('previewFeatures = ["referentialIntegrity"]');
    });

    it('should render generator engineType', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('engineType = "library"');
    });

    it('should render generator binaryTarget', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
      expect(generatedSchema).toContain('binaryTargets = ["native"]');
    });

    it('should render generator env var in binaryTarget', async () => {
      const generatedSchemaWithBinaryEnv = await getGeneratedSchema([
        'feature-specific/generators/generator-binary-env.prisma'
      ]);

      expect(generatedSchemaWithBinaryEnv).toContain(`binaryTargets = [env("BINARY_TARGETS")]`);
    });

    it('should render custom generator options', async () => {
      const generatedSchemaWithCustomGenOptions = await getGeneratedSchema([
        'feature-specific/generators/generator-custom.prisma'
      ]);

      expect(generatedSchemaWithCustomGenOptions).toContain(`createCRUD = "C-R-U-D"`);
    });
  });

  describe('Model Blocks', () => {
    describe('Models', () => {
      it('should render a model', async () => {
        const generatedSchema = await getGeneratedSchema(['feature-specific/models/model.prisma']);
        expect(generatedSchema).toContain('model User');
      });

      describe('@@id', () => {
        it('should render an @@id([])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@id.prisma'
          ]);
          expect(generatedSchema).toContain('@@id([id])');
        });

        it('should render an @@id(fields: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@id-fields.prisma'
          ]);
          expect(generatedSchema).toContain('@@id(fields: [id])');
        });

        it('should render an @@id(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@id-name.prisma'
          ]);
          expect(generatedSchema).toContain('@@id(name: "unique", [id])');
        });

        it('should render an @@id(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@id-map.prisma'
          ]);
          expect(generatedSchema).toContain('@@id(map: "unique", [id])');
        });
      });

      describe('@@fulltext', () => {
        it('should render an @@fulltext([])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@fulltext.prisma'
          ]);
          expect(generatedSchema).toContain(' @@fulltext([title(sort: Desc), content])');
        });
      });

      describe('@@unique', () => {
        it('should render an @@unique([])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@unique.prisma'
          ]);
          expect(generatedSchema).toContain('@@unique([id])');
        });

        it('should render an @@unique(fields: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@unique-fields.prisma'
          ]);
          expect(generatedSchema).toContain('@@unique(fields: [id])');
        });

        it('should render an @@unique(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@unique-name.prisma'
          ]);
          expect(generatedSchema).toContain('@@unique(name: "unique", [id])');
        });

        it('should render an @@unique(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@unique-map.prisma'
          ]);
          expect(generatedSchema).toContain('@@unique(map: "unique", [id])');
        });
      });

      describe('@@index', () => {
        it('should render an @@index([])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@index.prisma'
          ]);
          expect(generatedSchema).toContain('@@index([id])');
        });

        it('should render an @@index(fields: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@index-fields.prisma'
          ]);
          expect(generatedSchema).toContain('@@index(fields: [id])');
        });

        it('should render an @@index(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@index-name.prisma'
          ]);
          expect(generatedSchema).toContain('@@index(name: "unique", [id])');
        });

        it('should render an @@index(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@index-map.prisma'
          ]);
          expect(generatedSchema).toContain('@@index(map: "unique", [id])');
        });
      });

      describe('@@map', () => {
        it('should render an @@map("")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@map.prisma'
          ]);
          expect(generatedSchema).toContain('@@map("test")');
        });

        it('should render an @@map(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@map-name.prisma'
          ]);
          expect(generatedSchema).toContain('@@map(name: "test")');
        });
      });

      describe('@@ignore', () => {
        it('should NOT render an @@ignore model', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/models/model-@@ignore.prisma'
          ]);
          expect(generatedSchema).not.toContain('model User');
        });
      });
    });

    describe('Model Fields', () => {
      it('should merge duplicate fields', async () => {
        const generatedSchema = await getGeneratedSchema(['duplicates/*.prisma']);
        expect(generatedSchema).toContain('userId BigInt @id @default(autoincrement())');
      });

      it('should render ?', async () => {
        const generatedSchema = await getGeneratedSchema([
          'feature-specific/model-fields/model-field-?.prisma'
        ]);
        expect(generatedSchema).toContain('date DateTime?');
      });

      it('should render []', async () => {
        const generatedSchema = await getGeneratedSchema([
          'feature-specific/model-fields/model-field-[].prisma'
        ]);
        expect(generatedSchema).toContain('data String[]');
      });

      describe('@id', () => {
        it('should render @id', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@db.prisma'
          ]);
          expect(generatedSchema).toContain('updatedAt DateTime @updatedAt @db.DateTime(6)');
        });
      });

      describe('@id', () => {
        it('should render @id', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@id.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id');
        });

        it('should render @id(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@id-map.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id(map: "test")');
        });

        it('should render @id(length: 1)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@id-length.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id(length: 1)');
        });

        it('should render @id(sort: "Asc")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@id-sort.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id(sort: Asc)');
        });
      });

      describe('@default', () => {
        it('should render @default("")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@default.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id @default("test")');
        });

        it('should render @default(value: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@default-value.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id @default(value: 99)');
        });

        it('should render @default(map: "", "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@default-map.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id @default(map: "mapping", "test")');
        });

        it('should render @default values that have a string length under 1', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@default-0.prisma'
          ]);
          expect(generatedSchema).toContain('count Int @default(2)');
        });
      });

      describe('@unique', () => {
        it('should render @unique', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@unique.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id @unique');
        });

        it('should render @unique(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@unique-map.prisma'
          ]);
          expect(generatedSchema).toContain('@unique(map: "mapping")');
        });

        it('should render @unique(length: 1)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@unique-length.prisma'
          ]);
          expect(generatedSchema).toContain('id String @unique(length: 1)');
        });

        it('should render @unique(sort: Asc)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@unique-sort.prisma'
          ]);
          expect(generatedSchema).toContain('id String @unique(sort: Asc)');
        });
      });

      describe('@relation', () => {
        it('should render @relation("")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation.prisma'
          ]);
          expect(generatedSchema).toContain('@relation("UserPost")');
        });

        it('should render @relation(fields: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation.prisma'
          ]);
          expect(generatedSchema).toContain('fields: [id]');
        });

        it('should render @relation(references: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation.prisma'
          ]);
          expect(generatedSchema).toContain('references: [id]');
        });

        it('should render @relation(name: "", fields: [], references: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-name.prisma'
          ]);
          expect(generatedSchema).toContain(
            '@relation(name: "UserPost", fields: [id], references: [id])'
          );
        });

        it('should render @relation(fields: [], references: [])', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-unnamed.prisma'
          ]);
          expect(generatedSchema).toContain('@relation(fields: [id], references: [id])');
        });

        it('should render @relation(onDelete: action)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-ondelete.prisma'
          ]);
          expect(generatedSchema).toContain('onDelete: Cascade');
          expect(generatedSchema).toContain('fields: [id]');
          expect(generatedSchema).toContain('references: [id]');
        });

        it('should render @relation(onUpdate: action)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-onupdate.prisma'
          ]);
          expect(generatedSchema).toContain('onUpdate: Cascade');
          expect(generatedSchema).toContain('fields: [id]');
          expect(generatedSchema).toContain('references: [id]');
        });

        it('should render @relation(map: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-map.prisma'
          ]);
          expect(generatedSchema).toContain(
            '@relation(map: "Test", fields: [id], references: [id])'
          );
        });
      });

      describe('@map', () => {
        it('should render @map("")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@map.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id @map("test")');
        });

        it('should render @map(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@map-name.prisma'
          ]);
          expect(generatedSchema).toContain('id Int @id @map(name: "test")');
        });
      });

      describe('@updatedAt', () => {
        it('should render @updatedAt', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@updatedAt.prisma'
          ]);
          expect(generatedSchema).toContain('date DateTime @updatedAt');
        });
      });

      describe('@ignore', () => {
        it('should NOT render @ignore', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@ignore.prisma'
          ]);
          expect(generatedSchema).toContain('@ignore');
        });
      });
    });
  });

  describe('Enum Blocks', () => {
    it('should render an enum', async () => {
      const generatedSchema = await getGeneratedSchema(['feature-specific/enums/enum.prisma']);
      expect(generatedSchema).toContain('enum Test');
      expect(generatedSchema).toContain('TestValue');
    });

    it('should render an enum value with only one letter', async () => {
      const generatedSchema = await getGeneratedSchema([
        'feature-specific/enums/enum-single-letter.prisma'
      ]);

      expect(generatedSchema).toContain('enum Names');

      const fields = generatedSchema
        .split('enum Names {')[1]
        .split('}')[0]
        .split(' ')
        .filter((field) => field.length);

      expect(fields.some((field) => field === 'X')).toBeTruthy();
    });
  });

  describe('Glob Config', () => {
    it('should render global Glob Files', async () => {
      const generatedSchema = await getGeneratedSchema(['glob-test/**/*.prisma']);

      expect(generatedSchema).toContain('generator client');
      expect(generatedSchema).toContain('datasource db');
      expect(generatedSchema).toContain('model Person');
      expect(generatedSchema).toContain('model User');
      expect(generatedSchema).toContain('enum Environment');
      expect(generatedSchema).toContain('enum Test');
    });

    it('should render individual Glob Files', async () => {
      const generatedSchema = await getGeneratedSchema([
        'glob-test/providers/*.prisma',
        'glob-test/enums/*.prisma',
        'glob-test/models/*.prisma'
      ]);

      expect(generatedSchema).toContain('generator client');
      expect(generatedSchema).toContain('datasource db');
      expect(generatedSchema).toContain('model Person');
      expect(generatedSchema).toContain('model User');
      expect(generatedSchema).toContain('enum Environment');
      expect(generatedSchema).toContain('enum Test');
    });

    it('should render mixed Glob Files', async () => {
      const generatedSchema = await getGeneratedSchema([
        'glob-test/providers/datasource.prisma',
        'glob-test/models/*.prisma',
        'glob-test/enums/environment.prisma'
      ]);

      expect(generatedSchema).not.toContain('generator client');
      expect(generatedSchema).toContain('datasource db');
      expect(generatedSchema).toContain('model Person');
      expect(generatedSchema).toContain('model User');
      expect(generatedSchema).toContain('enum Environment');
      expect(generatedSchema).not.toContain('enum Test');
    });

    it('should throw imaginary Glob Files', async () => {
      // SHHHH! Don't display the expected error on this test in console!
      spyOn(console, 'error');
      await expect(
        // eslint-disable-next-line no-console
        getGeneratedSchema([
          'glob-test/providers/*.prisma',
          'glob-test/enums/*.prisma',
          'glob-test/models/*.prisma',
          'glob-test/nonexistent/*.prisma'
        ])
      ).rejects.toThrow();
    });
  });
});
