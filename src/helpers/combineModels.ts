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
        acc[curr.name].extendedFields = acc[curr.name].extendedFields.reduce((fields: any[], field: any) => {
          // If we don't already have this field
          if (!fields.map((field) => field.name).includes(field.name)) {
            fields.push(field);
          }
          return fields;
        }, curr.fields);

        acc[curr.name].extendedModelAttributes = acc[curr.name].extendedModelAttributes.reduce((fields: any[], field: any) => {
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
