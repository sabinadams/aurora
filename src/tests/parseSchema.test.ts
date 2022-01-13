import { parseSchema } from '../helpers';

describe('Parse Schema Function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('Models', () => {
    it('Should get all of the models', async () => {
      const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma');
      expect(models.length).toBe(2);
    });

    it('Should find @map attributes', async () => {
      const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma');
      const model = models.find((model) => model.name === 'User');
      const field = model?.extendedFields.find((field: any) => field.name === 'firstName');

      expect(field?.attributesFixed[0].name).toBe('first_name');
    });

    it('Should find @@index attributes', async () => {
      const { models } = await parseSchema('./src/tests/schemas/parseSchema.prisma');
      const model = models.find((model) => model.name === 'Person');
      expect(model?.extendedModelAttributes.length).toBe(1);
      expect(model?.extendedModelAttributes[0].name).toBe(null);
      expect(model?.extendedModelAttributes[0].attributesFixed[0].fields).toEqual(['id']);
    });
  });
});
