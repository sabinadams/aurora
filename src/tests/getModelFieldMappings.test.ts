import getModelFieldMappings from '../helpers/getModelFieldMappings'

describe('getModelFieldMappings()', () => {
  it('Should find a mapping and return it in a readable format', () => {
    const schema = `
    model Test {
      id Int @map("test_mapping")
    }
    `

    const mappings = getModelFieldMappings( schema.trim() )

    expect(Object.keys(mappings)).toContain('Test')
    expect(Object.keys(mappings['Test'])).toContain('id')
    expect(mappings['Test']['id']).toBe('test_mapping')
  });

  it('Should find multiple mappings and return them in a readable format', () => {
    const schema = `
        model Test {
            id Int @map("test_mapping")
            name Int @map("test_name")
            lastName String
        }
    `

    const mappings = getModelFieldMappings( schema.trim() )

    expect(Object.keys(mappings)).toEqual(['Test'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name'])
    expect(mappings['Test']['id']).toBe('test_mapping')
    expect(mappings['Test']['name']).toBe('test_name')
  });

  it('Should find mappings in all models', () => {
    const schema = `
model Test {
    id Int @map("test_mapping")
    name Int @map("test_name")
    lastName String
}
model Person {
    id Int @map("test_mapping")
    lastName String
}
    `

    const mappings = getModelFieldMappings( schema.trim() )

    expect(Object.keys(mappings)).toEqual(['Test', 'Person'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name'])
    expect(Object.keys(mappings['Person'])).toContain('id')
    expect(mappings['Test']['id']).toBe('test_mapping')
    expect(mappings['Test']['name']).toBe('test_name')
    expect(mappings['Person']['id']).toBe('test_mapping')
  });

  it('Should not consider @@map', () => {
    const schema = `
    model Test {
        id Int @map("test_mapping")
        name Int @map("test_name")
        lastName String

        @@map("test")
    }
    `

    const mappings = getModelFieldMappings( schema.trim() )
    expect(Object.keys(mappings)).toEqual(['Test'])
    expect(Object.keys(mappings['Test'])).toEqual(['id', 'name']) 
  });
});
