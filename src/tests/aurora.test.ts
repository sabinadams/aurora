import mockConfigFetcher from './helpers/mockConfigFetcher'
import * as helpers from '../helpers'
import aurora from '../aurora'

async function getGeneratedSchema( paths: string[] ) {
    mockConfigFetcher(paths)
    await aurora()
    return jest.spyOn(helpers, 'writeSchema').mock.calls[0][1].replace(/\s+/g, ' ')
}

describe('aurora()', () => {
    beforeAll(() => {
        process.env.DATABASE_URL = 'file:./dev.db'
        process.env.SHADOW_DATABASE_URL = 'file:./shadow.db'
        process.env.BINARY_TARGETS = 'native'
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Datasource Blocks', () => {
        let generatedSchema = ''
        let generatedSchemaWithEnv = ''

        beforeAll(async () => {
            generatedSchema = await getGeneratedSchema(['feature-specific/datasource/datasource-url.prisma'])
            generatedSchemaWithEnv = await getGeneratedSchema(['feature-specific/datasource/datasource-url.prisma'])
        })

        it('should render datasource name', () => {
            expect(generatedSchema).toContain('datasource db')
        })

        it('should render provider', () => {
            expect(generatedSchema).toContain('provider = "sqlite"')
        })

        it('should render url', () => {
            expect(generatedSchema).toContain('url = "file:./dev.db"')
        })

        it('should render shadowDatabaseUrl', () => {
            expect(generatedSchema).toContain('shadowDatabaseUrl = "file:./shadow.db"')
        })

        it('should render referentialIntegrity', () => {
            expect(generatedSchema).toContain('referentialIntegrity = "prisma"')
        })
    
        it('should env var in url', () => {
            expect(generatedSchemaWithEnv).toContain('url = env("DATABASE_URL")')
        })

        it('should render env var in shadowDatabaseUrl', () => {
            expect(generatedSchemaWithEnv).toContain('shadowDatabaseUrl = env("SHADOW_DATABASE_URL")')
        })
    })
    
    describe('Generator Blocks', () => {
        let generatedSchema = ''
        let generatedSchemaWithBinaryEnv = ''
        beforeAll(async () => {
            generatedSchema = await getGeneratedSchema(['feature-specific/generators/generator.prisma'])
            generatedSchemaWithBinaryEnv = await getGeneratedSchema(['feature-specific/generators/generator.prisma'])
        })
    
        it('should render generator name', () => {
            expect(generatedSchema).toContain('generator client')
        })

        it('should render generator provider', () => {
            expect(generatedSchema).toContain('provider = "prisma-client-js"')
        })

        it('should render generator output', () => {
            expect(generatedSchema).toContain('output = "../src/generated"')
        })

        it('should render generator previewFeatures', () => {
            expect(generatedSchema).toContain('previewFeatures = ["referentialIntegrity"]')
        })

        it('should render generator engineType', () => {
            expect(generatedSchema).toContain('engineType = "library"')
        })

        it('should render generator binaryTarget', () => {
            expect(generatedSchema).toContain('binaryTargets = ["native"]')
        })

        it('should render generator env var in binaryTarget', () => {
            expect(generatedSchemaWithBinaryEnv).toContain('binaryTargets = env("BINARY_TARGETS")')
        })
    })

    describe('Model Blocks', () => {
        describe('Models', () => {
            it('should render a model', async () => {
                const generatedSchema = await getGeneratedSchema(['feature-specific/models/model.prisma'])
                expect(generatedSchema).toContain('model User')
            })
            
            describe('@@id', () => {
                it('should render an @@id([])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@id.prisma'])
                    expect(generatedSchema).toContain('@@id([id])')
                })
    
                it('should render an @@id(fields: [])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@id-fields.prisma'])
                    expect(generatedSchema).toContain('@@id(fields: [id])')
                })
    
                it('should render an @@id(name: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@id-name.prisma'])
                    expect(generatedSchema).toContain('@@id(name: "unique", [id])')
                })
    
                it('should render an @@id(map: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@id-map.prisma'])
                    expect(generatedSchema).toContain('@@id(map: "unique", [id])')
                })
            })

            describe('@@unique', () => {
                it('should render an @@unique([])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@unique.prisma'])
                    expect(generatedSchema).toContain('@@unique([id])')
                })
    
                it('should render an @@unique(fields: [])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@unique-fields.prisma'])
                    expect(generatedSchema).toContain('@@unique(fields: [id])')
                })
    
                it('should render an @@unique(name: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@unique-name.prisma'])
                    expect(generatedSchema).toContain('@@unique(name: "unique", [id])')
                })
    
                it('should render an @@unique(map: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@unique-map.prisma'])
                    expect(generatedSchema).toContain('@@unique(map: "unique", [id])')
                })
            })

            describe('@@index', () => {
                it('should render an @@index([])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@index.prisma'])
                    expect(generatedSchema).toContain('@@index([id])')
                })
    
                it('should render an @@index(fields: [])', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@index-fields.prisma'])
                    expect(generatedSchema).toContain('@@index(fields: [id])')
                })
    
                it('should render an @@index(name: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@index-name.prisma'])
                    expect(generatedSchema).toContain('@@index(name: "unique", [id])')
                })
    
                it('should render an @@index(map: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@index-map.prisma'])
                    expect(generatedSchema).toContain('@@index(map: "unique", [id])')
                })
            })

            describe('@@map', () => {
                it('should render an @@map("")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@map.prisma'])
                    expect(generatedSchema).toContain('@@map("test")')
                })
    
                it('should render an @@map(name: "")', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@map-name.prisma'])
                    expect(generatedSchema).toContain('@@map(name: "test")')
                })
            })

            describe('@@ignore', () => {
                it('should NOT render an @@ignore model', async () => {
                    const generatedSchema = await getGeneratedSchema(['feature-specific/models/model-@@ignore.prisma'])
                    expect(generatedSchema).not.toContain('@@ignore')
                })
            })
        })

        describe('Model Fields', () => {

        })
    })
});
