import getModelFieldIndexes from '../helpers/getModelFieldIndexes'

describe('getModelFieldIndexes()', () => {
  it('Should find the indexes and return them in a readable format', () => {
    const schema = `
    model Test {
      @@index([test, id])
    }
    `

    const indexes = getModelFieldIndexes( schema.trim() )

    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'].length).toBe(1)
    expect(indexes['Test'][0].fields.length).toBe(2)
    expect(indexes['Test'][0].fields).toEqual(['test', 'id'])
  });

  it('Should handle a name', () => {
    const schema = `
    model Test {
      @@index(name: "testIndex", [test, id])
    }
    `

    const indexes = getModelFieldIndexes( schema.trim() )

    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'][0].name).toBe('testIndex')
  });

  it('Should handle no name', () => {
    const schema = `
    model Test {
      @@index([test, id])
    }
    `

    const indexes = getModelFieldIndexes( schema.trim() )

    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'][0].name).toBeNull()
  });

  it('Should handle multiple models', () => {
    const schema = `model Test {
  @@index(name: "testIndex", [test, id])
}

model Thing {
  @@index([test, id])
}`

    const indexes = getModelFieldIndexes( schema.trim() )
    expect(Object.keys(indexes)).toContain('Test')
    expect(Object.keys(indexes)).toContain('Thing')
  });

  it('Should handle multiple indexes', () => {
    const schema = `
    model Test {
      @@index([firstName])
      @@index(name: "test", [test, id])
    }
    `

    const indexes = getModelFieldIndexes( schema.trim() )

    expect(Object.keys(indexes)).toContain('Test')
    expect(indexes['Test'].length).toBe(2)
    expect(indexes['Test'][0].name).toBeNull()
    expect(indexes['Test'][0].fields).toEqual(['firstName'])
    expect(indexes['Test'][1].name).toBe('test')
    expect(indexes['Test'][1].fields).toEqual(['test', 'id'])
  })
});
