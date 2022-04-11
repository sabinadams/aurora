import { DMMF } from '@prisma/generator-helper';

/**
 *
 * @param rawEnums A list of Prisma models to combine in a way that doesn't duplicate fields
 * @returns A list of Prisma Models
 */
export function combineEnums(rawEnums: DMMF.DatamodelEnum[]): DMMF.DatamodelEnum[] {
  const enums: Record<string, DMMF.DatamodelEnum> = rawEnums.reduce(
    (acc: Record<string, DMMF.DatamodelEnum>, curr: DMMF.DatamodelEnum) => {
      // If we already saw this model
      if (acc[curr.name]) {
        acc[curr.name].values = acc[curr.name].values.reduce((values: any[], field: any) => {
          // If we don't already have this field
          if (!values.map((field) => field.name).includes(field.name)) {
            values.push(field);
          }
          return values;
        }, curr.values);
      } else {
        // Add the model to our record
        acc[curr.name] = curr;
      }

      return acc;
    },
    {}
  );

  return Object.values(enums);
}
