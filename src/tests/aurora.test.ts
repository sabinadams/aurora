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

    })
});
