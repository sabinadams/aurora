import { ModelMapping } from '../models'

/**
 * 
 * @param datamodel The datamodel string
 * @returns An object like { User: { firstName: 'first_name' } }
 */
export default function ( datamodel: string ): { [K: string]: ModelMapping } {
    // Split the schema up by the ending of each block and then keep each starting with 'model'
    // This should essentially give us an array of the model blocks
    const modelChunks = datamodel.split('}').filter( chunk => chunk.trim().indexOf('model') === 0 )
    return modelChunks.reduce( (modelDefinitions: {[k: string]: any}, modelChunk: string) => {
        // Split the model chunk by line to get the individual fields
        // The first line will have a model name which we will pull out later
        let pieces = modelChunk.split('\n').filter( chunk => chunk.trim().length )

        // Get all of the model's fields out that have the @map attribute
        const fieldsWithMappings = pieces.slice(1)
            // Clean up new lines and spaces out of the string
            .map(field => field.replace(/\t/g, '').trim())
            // Get rid of any fields that don't even have a @map
            .filter( field => /\s@map\("(.*)"\)/g.test(field))
            
        // Add an index to the reduced array named the model's name
        // The value is an object whose keys are field names and their values are mapping names
        modelDefinitions[pieces[0].split(' ')[1]] = fieldsWithMappings.reduce((mappings: ModelMapping, field) => ({
            ...mappings,
            [field.trim().split(' ')[0]]: field.split('@map("')[1].split('"')[0]
        }), {})
        return modelDefinitions
      }, {})
}