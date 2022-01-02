import { parseSchema } from '../helpers'

describe('Parse Schema Function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe("Models", () => {
        it('Should get all of the models', async () => {
            const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma')
            expect(models.length).toBe(2)
        })

        it('Should find @map attributes', async () => {
            const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma')
            const model = models.find( model => model.name === 'User' )
            const field = model?.fields.find( field => field.name === 'firstName' )

            expect(field?.columnName).toBe('first_name')
        })

        it('Should find @@index attributes', async () => {
            const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma')
            const model = models.find( model => model.name === 'Person' )

            expect(model?.indexes.length).toBe(1)
            expect(model?.indexes[0]).toEqual({
                name: null,
                fields: ['id']
            })
        })
    })
})