import mockConfigFetcher from './helpers/mockConfigFetcher'
import * as helpers from '../helpers'
import aurora from '../aurora'

describe('aurora()', () => {
    beforeAll(() => {
        process.env.DATABASE_URL = 'file:./dev.db'
        process.env.SHADOW_DATABASE_URL = 'file:./shadow.db'
    })
    beforeEach(() => {
        jest.clearAllMocks()
    })
    describe('Datasource Blocks', () => {
        it('Should render the datasource', async () => {
            mockConfigFetcher(['feature-specific/datasource/datasource-provider-url.prisma'])
            await aurora()
            const generatedSchema = jest.spyOn(helpers, 'writeSchema').mock.calls[0][1].replace(/\s+/g, ' ')
            expect(generatedSchema).toContain('datasource db')
            expect(generatedSchema).toContain('provider = "sqlite"')
            expect(generatedSchema).toContain('url = "file:./dev.db"')
            expect(generatedSchema).toContain('shadowDatabaseUrl = "file:./shadow.db"')
            expect(generatedSchema).toContain('referentialIntegrity = "prisma"')
        })

        it('Should render the datasource with an environment variable', async () => {
            mockConfigFetcher(['feature-specific/datasource/datasource-provider-envurl.prisma'])
            await aurora()
            const generatedSchema = jest.spyOn(helpers, 'writeSchema').mock.calls[0][1].replace(/\s+/g, ' ')
            expect(generatedSchema).toContain('url = env("DATABASE_URL")')
            expect(generatedSchema).toContain('shadowDatabaseUrl = env("SHADOW_DATABASE_URL")')
        })
    })
   
});
