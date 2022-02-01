import { DMMF } from '@prisma/generator-helper';

/**
 *
 * @param rawModels A list of Prisma models to combine in a way that doesn't duplicate fields
 * @returns A list of Prisma Models
 */
export function combineModels(rawModels: DMMF.Model[]): DMMF.Model[] {
  const models: Record<string, DMMF.Model> = rawModels.reduce(
    (acc: Record<string, DMMF.Model>, curr: DMMF.Model) => {
      // If we already saw this model
      if (acc[curr.name]) {
        // Merge the fields arrays starting with the current model's fields as the source
        acc[curr.name].extendedFields = acc[curr.name].extendedFields.reduce(
          (fields: any[], field: any) => {
            // If we don't already have this field
            if (!fields.map((field) => field.name).includes(field.name)) {
              fields.push(field);
            } else {
              const indexOfExisting = fields.findIndex(
                (existingField) => existingField.name === field.name
              );
              const existing = fields.find((existingField) => existingField.name === field.name);
              // Combine the attributes
              fields[indexOfExisting].attributes = Array.from(
                new Set([...fields[indexOfExisting].attributes, ...field.attributes])
              );

              // Get a list of all of the old and new
              let attributes = [...existing.attributesFixed, ...field.attributesFixed];
              // Combine them and merge attribute options (some data can be lost here)
              attributes = Array.from(
                new Set(
                  attributes.map((attr) => {
                    // Get a list of all versions of this attribute
                    const likeAttributes = attributes.filter(
                      (likes) => attr.attributeType === likes.attributeType
                    );
                    // Merge (can get rid of some conflicting options)
                    attr = Object.assign(attr, ...likeAttributes);
                    // We want a string so we can get unique options in a set
                    return JSON.stringify(attr);
                  })
                )
              ).map((attr) => JSON.parse(attr)); // Now we can parse that string and get JSON again

              fields[indexOfExisting].attributesFixed = attributes;
            }
            return fields;
          },
          curr.extendedFields
        );

        acc[curr.name].extendedModelAttributes = acc[curr.name].extendedModelAttributes.reduce(
          (fields: any[], field: any) => {
            // If we don't already have this field
            if (!fields.map((field) => field.name).includes(field.name)) {
              fields.push(field);
            }
            return fields;
          },
          curr.extendedModelAttributes
        );

        acc[curr.name].fields = acc[curr.name].fields.reduce((fields: any[], field: any) => {
          // If we don't already have this field
          if (!fields.map((field) => field.name).includes(field.name)) {
            fields.push(field);
          }
          return fields;
        }, curr.fields);
      } else {
        // Add the model to our record
        acc[curr.name] = curr;
      }

      return acc;
    },
    {}
  );

  return Object.values(models);
}
