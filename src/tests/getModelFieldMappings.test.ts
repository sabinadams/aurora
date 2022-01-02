import getModelFieldMappings from '../helpers/getModelFieldMappings'
import readFile from './helpers/readFile'

describe('getModelFieldMappings()', () => {
  it('Should find a mapping and return it in a readable format', async () => {
    const schema = await readFile('./schemas/getModelFieldMappings/singleMapping.prisma')
    const mappings = getModelFieldMappings( schema.trim() )
    expect(Object.keys(mappings)).toContain('Test')
    expect(Object.keys(mappings['Test'])).toContain('id')
    expect(mappings['Test']['id']).toBe('test_mapping')
  });

  it('Should find multiple mappings and return them in a readable format', async () => {
    const schema = await readFile('./schemas/getModelFieldMappings/multiMappings.prisma')
    const mappings = getModelFieldMappings( schema.trim() )
    expect(Object.keys(mappings)).toEqual(['Test'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name'])
    expect(mappings['Test']['id']).toBe('test_mapping')
    expect(mappings['Test']['name']).toBe('test_name')
  });

  it('Should find mappings in all models', async () => {
    const schema = await readFile('./schemas/getModelFieldMappings/multiModule.prisma')
    const mappings = getModelFieldMappings( schema.trim() )
    expect(Object.keys(mappings)).toEqual(['Test', 'Person'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name'])
    expect(Object.keys(mappings['Person'])).toContain('id')
    expect(mappings['Test']['id']).toBe('test_mapping')
    expect(mappings['Test']['name']).toBe('test_name')
    expect(mappings['Person']['id']).toBe('test_mapping')
  });

  it('Should not consider @@map', async () => {
    const schema = await readFile('./schemas/getModelFieldMappings/withModelMap.prisma')
    const mappings = getModelFieldMappings( schema.trim() )
    expect(Object.keys(mappings)).toEqual(['Test'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name']) 
  });
});
