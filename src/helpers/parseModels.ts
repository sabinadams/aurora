import { ModelFields } from '../models'
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like:
 * ```json
 * { "Person": [ { name: 'id', type: 'int', attributes: ['@id'], isModelAttribute: false, isFieldAttribute: true } ] }
 * ```
 */
export default function (datamodel: string): ModelFields {
  // Split the schema up by the ending of each block and then keep each starting with 'model'
  // This should essentially give us an array of the model blocks
  const modelChunks = datamodel.split('}').filter((chunk) => chunk.trim().indexOf('model') === 0);

  return modelChunks.reduce((modelDefinitions: { [k: string]: any }, modelChunk: string) => {
    // Split the model chunk by line to get the individual fields
    // The first line will have a model name which we will pull out later
    let pieces = modelChunk.split('\n').filter((chunk) => chunk.trim().length);

    return {
        ...modelDefinitions,
        [pieces[0].split(' ')[1]]: pieces
            // Don't need the name
            .slice(1)
            // Clean up new lines and spaces out of the string
            .map(field => {
                let [ name, type, ...attributes ] = field
                  .trim()
                  .replace(/\t/g, '')
                  .replace(/:\s/g, ':')
                  .replace(/,\s/g, ',')
                  .replace(/\s+/g, ' ')
                  .split(' ')

                const isModelAttribute = name.includes('@@')

                return {
                    name: isModelAttribute ? null : name, 
                    type: isModelAttribute ? null : type.replace('?', '').replace('[]', ''),
                    optional: isModelAttribute ? null : type.indexOf('?') > -1,
                    scalar: isModelAttribute ? null : type.indexOf('[]') > -1,
                    attributes: isModelAttribute ? [ name ] : [...attributes],
                    isModelAttribute,
                    isFieldAttribute: !isModelAttribute
                }
            })
    }
  }, {});
}
