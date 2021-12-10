import { DMMF } from "@prisma/client/runtime";

export async function combineModels(
  rawModels: DMMF.Model[]
): Promise<DMMF.Model[]> {
  const models: Record<string, DMMF.Model> = rawModels.reduce(
    (acc: Record<string, DMMF.Model>, curr: DMMF.Model) => {
      if (acc[curr.name]) {
        acc[curr.name].fields = acc[curr.name].fields.reduce((fields, field) => {
          if ( !fields.map( field => field.name ).includes(field.name) ) {
            fields.push(field)
          }
          return fields
        }, curr.fields)
      } else {
        acc[curr.name] = curr;
      }
      return acc;
    },
    {}
  );

  return Object.values(models);
}
