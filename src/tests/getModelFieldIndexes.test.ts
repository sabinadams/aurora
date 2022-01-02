import getModelFieldIndexes from '../helpers/getModelFieldIndexes'
import readFile from './helpers/readFile'

describe('getModelFieldIndexes()', () => {
  it('Should find the indexes and return them in a readable format', async () => {
    const schema = await readFile('./schemas/getModelFieldIndexes/singleIndex.prisma')
    const indexes = getModelFieldIndexes( schema.trim() )
    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'].length).toBe(1)
    expect(indexes['Test'][0].fields.length).toBe(2)
    expect(indexes['Test'][0].fields).toEqual(['test', 'id'])
  });

  it('Should handle a name', async () => {
    const schema = await readFile('./schemas/getModelFieldIndexes/withName.prisma')
    const indexes = getModelFieldIndexes( schema.trim() )
    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'][0].name).toBe('testIndex')
  });

  it('Should handle multiple models', async () => {
    const schema = await readFile('./schemas/getModelFieldIndexes/multipleModels.prisma')
    const indexes = getModelFieldIndexes( schema.trim() )
    expect(Object.keys(indexes)).toContain('Test')
    expect(Object.keys(indexes)).toContain('Thing')
  });

  it('Should handle multiple indexes', async () => {
    const schema = await readFile('./schemas/getModelFieldIndexes/multipleIndexes.prisma')
    const indexes = getModelFieldIndexes( schema.trim() )
    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'].length).toBe(2)
    expect(indexes['Test'][0].name).toBeNull()
    expect(indexes['Test'][0].fields).toEqual(['firstName'])
    expect(indexes['Test'][1].name).toBe('test')
    expect(indexes['Test'][1].fields).toEqual(['test', 'id'])
  })
});
