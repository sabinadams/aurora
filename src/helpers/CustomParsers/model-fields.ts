import { ModelFields, ModelAttribute } from '../../models';
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like [{ name: 'firstName_lastName', fields: ['firstName', 'lastName'] }]
 */
export default function parseModelFields(models: ModelFields): ModelFields {
  return Object.keys(models).reduce( (acc, curr) => ({
    ...acc,
    [curr]: models[curr].map( field => {
      field.attributes = field.attributes.map( attribute => {
        const getMatchIndices = ( regex: RegExp, str: string )  => {
          var result = [];
          var match;
          regex = new RegExp(regex);
          while (match = regex.exec(str))
             result.push(match.index);
          return result;
       }
        const indices = getMatchIndices(/[^@]@/g, attribute)

        indices.forEach( index => {
          attribute = attribute.slice(0, index + 1) + ' ' + attribute.slice(index + 1)
        })
        return attribute.split(' ')
      }).flat()

      field.attributesFixed = field.attributes.map( attribute => {
        let attributeObject: ModelAttribute = { 
          default: null,
          fields: null,
          references: null,
          map: null,
          name: null,
          attributeType: '',
          value: null,
          length: null,
          sort: null,
          onUpdate: null,
          onDelete: null
        }

        attributeObject.attributeType = attribute.indexOf('(') > -1 ? attribute.split("(")[0] : attribute
        if ( attribute.indexOf('[') > -1 && attribute.indexOf('fields:') == -1) {
          attributeObject.fields = attribute.split('[')[1].split(']')[0].split(',')
        }

        if ( attribute.indexOf('fields:') > -1) {
          attributeObject.fields = attribute.split('fields:')[1].split('[')[1].split(']')[0].split(',')
          attribute = attribute.replace(`fields: [${attributeObject.fields.join(', ')}]`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('references:') > -1) {
          attributeObject.references = attribute.split('references:')[1].split('[')[1].split(']')[0].split(',')
          attribute = attribute.replace(`references: [${attributeObject.references.join(', ')}]`, '').split(',').map( chunk => chunk.trim()).join('')
        }
     
        if ( attribute.indexOf('name:') > -1 ) {
          attributeObject.name = attribute.split('name:')[1].split('"')[1].trim()
          attribute = attribute.replace(`name:"${attributeObject.name}"`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('map:') > -1 ) {
          attributeObject.map = attribute.split('map:')[1].split('"')[1].trim()
          attribute = attribute.replace(`map:"${attributeObject.map}"`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('length:') > -1 ) {
          attributeObject.length = attribute.split('length:')[1].split(',')[0].split(')')[0]
          attribute = attribute.replace(`length: ${attributeObject.length}`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('sort:') > -1 ) {
          attributeObject.sort = attribute.split('sort:')[1].split(',')[0].split(')')[0]
          attribute = attribute.replace(`sort: ${attributeObject.sort}`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('onUpdate:') > -1 ) {
          attributeObject.onUpdate = attribute.split('onUpdate:')[1].split(',')[0].split(')')[0]
          attribute = attribute.replace(`onUpdate: ${attributeObject.onUpdate}`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attribute.indexOf('onDelete:') > -1 ) {
          attributeObject.onDelete = attribute.split('onDelete:')[1].split(',')[0].split(')')[0]
          attribute = attribute.replace(`onDelete: ${attributeObject.onDelete}`, '').split(',').map( chunk => chunk.trim()).join('')
        }
        
        if ( attribute.indexOf('value:') > -1 ) {
          attributeObject.value = attribute.split('value:')[1].split(',')[0].split(')')[0]
          attribute = attribute.replace(`value:${attributeObject.value}`, '').split(',').map( chunk => chunk.trim()).join('')
        }

        if ( attributeObject.attributeType !== '@default' && attribute.indexOf('(') > -1 && attribute.split('(')[1].charAt(0) == '"' ) {
          attributeObject.name = attribute.split('("')[1].split('")')[0]
          attribute = attribute.replace(`${attributeObject.attributeType}("${attributeObject.name}")`, '').split(',').map( chunk => chunk.trim()).join('')
        }
        
        if ( attributeObject.attributeType === '@default' && !attributeObject.default ) {
          attributeObject.default = attribute.split('default(')[1].slice(0, -1)
          attribute = attribute.replace(`@default(${attributeObject.default})`, '').split(',').map( chunk => chunk.trim()).join('')
        }
     
        return attributeObject
      })
      return field
    })
  }), {})
}
