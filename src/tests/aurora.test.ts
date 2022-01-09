import mockConfigFetcher from './helpers/mockConfigFetcher';
import * as helpers from '../helpers';
import aurora from '../aurora';

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
    let generatedSchema = '';
    let generatedSchemaWithBinaryEnv = '';
    beforeAll(async () => {
      generatedSchema = await getGeneratedSchema(['feature-specific/generators/generator.prisma']);
      generatedSchemaWithBinaryEnv = await getGeneratedSchema([
        'feature-specific/generators/generator.prisma'
      ]);
    });

    it('should render generator name', () => {
      expect(generatedSchema).toContain('generator client');
    });

    it('should render generator provider', () => {
      expect(generatedSchema).toContain('provider = "prisma-client-js"');
    });

    it('should render generator output', () => {
      expect(generatedSchema).toContain('output = "../src/generated"');
    });

    it('should render generator previewFeatures', () => {
      expect(generatedSchema).toContain('previewFeatures = ["referentialIntegrity"]');
    });

    it('should render generator engineType', () => {
      expect(generatedSchema).toContain('engineType = "library"');
    });

    it('should render generator binaryTarget', () => {
      expect(generatedSchema).toContain('binaryTargets = ["native"]');
    });

    it('should render generator env var in binaryTarget', () => {
      expect(generatedSchemaWithBinaryEnv).toContain('binaryTargets = env("BINARY_TARGETS")');
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

        it('should render @id(sort: Asc)', async () => {
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
          expect(generatedSchema).toContain('id String @id @default(value: "test")');
        });

        it('should render @default(map: "", "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@default-map.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id @default(map: "mapping", "test")');
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
          expect(generatedSchema).toContain('id Int @id @unique(map: "mapping")');
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
          expect(generatedSchema).toContain(
            '@relation(fields: [id], references: [id], onDelete: Cascade)'
          );
        });

        it('should render @relation(onUpdate: action)', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@relation-onupdate.prisma'
          ]);
          expect(generatedSchema).toContain(
            '@relation(fields: [id], references: [id], onUpdate: Cascade)'
          );
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
          expect(generatedSchema).toContain('id String @id @map("test")');
        });

        it('should render @map(name: "")', async () => {
          const generatedSchema = await getGeneratedSchema([
            'feature-specific/model-fields/model-field-@map-name.prisma'
          ]);
          expect(generatedSchema).toContain('id String @id @map(name: "test")');
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
          expect(generatedSchema).not.toContain('name String');
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
  });
});
