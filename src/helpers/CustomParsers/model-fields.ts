import { ModelFields } from '../../models';
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like [{ name: 'firstName_lastName', fields: ['firstName', 'lastName'] }]
 */
export default function parseModelFields(models: ModelFields): ModelFields {
  return Object.keys(models).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: models[curr].map((field) => {
        field.attributes = field.attributes
          .map((attribute) => {
            const getMatchIndices = (regex: RegExp, str: string) => {
              var result = [];
              var match;
              regex = new RegExp(regex);
              while ((match = regex.exec(str))) result.push(match.index);
              return result;
            };
            const indices = getMatchIndices(/[^@]@/g, attribute);

            indices.forEach((index) => {
              attribute = attribute.slice(0, index + 1) + ' ' + attribute.slice(index + 1);
            });
            return attribute.split(' ');
          })
          .flat();
        return field;
      })
    }),
    {}
  );
}
