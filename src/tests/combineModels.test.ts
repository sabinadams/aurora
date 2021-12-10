import { combineModels } from '../helpers';
import { DMMF } from '@prisma/client/runtime';

describe('combineModels()', () => {
  const baseField = {
    name: 'field1'
  };

  const baseModel = {
    name: 'Test',
    fields: [baseField] as DMMF.Field[],
    dbName: '',
    uniqueFields: [],
    uniqueIndexes: [],
    primaryKey: ''
  } as unknown as DMMF.Model;

  it('should properly merge models and fields', () => {
    const models = combineModels([
      baseModel,
      {
        ...baseModel,
        fields: [
          baseField as DMMF.Field,
          {
            ...baseField,
            name: 'field2'
          } as DMMF.Field
        ]
      }
    ]);

    const fieldNames = models[0].fields.map((field) => field.name);

    expect(fieldNames).toEqual(['field1', 'field2']);
  });
});
