import fs from 'fs';
import { promisify } from 'util';
import { getDMMF, getConfig, formatSchema } from '@prisma/sdk';
import type { DMMF } from '@prisma/client/runtime';
import type { SchemaInformation, IndexObject } from '../models';
import getModelFieldMappings from './getModelFieldMappings';
import getModelFieldIndexes from './getModelFieldIndexes';

import path from 'path';
const readFile = promisify(fs.readFile);

/**
 *
 * @param filePath Path to the Prisma file we are parsing
 */
export async function parseSchema(filePath: string): Promise<SchemaInformation> {
  try {
    // Reads the .prisma file
    let datamodel = await readFile(path.join(process.cwd(), filePath), { encoding: 'utf-8' });
    // Formats the schema
    datamodel = await formatSchema({schema: datamodel})

    // Grabs the DMMF and Config data using Prisma's SDK
    const dmmf = await getDMMF({ datamodel });
    const config = await getConfig({ datamodel });
  
    // Prisma doesn't give us the field mappings 
    const modelMappedFields = getModelFieldMappings(datamodel)
    // Prisma also doesn't give us the indexes
    const indexes = getModelFieldIndexes(datamodel)

    // Take our field mappings and inject a key on each model with our column name value
    const models = dmmf.datamodel.models.map( model => {
      model.fields = model.fields.map( field => {
        if ( modelMappedFields[model.name][field.name] )
          field.columnName = modelMappedFields[model.name][field.name]
        return field
      })
      model.indexes = indexes[model.name]
      return model
    }) as DMMF.Model[]

    return {
      models: models as unknown as (DMMF.Model & { indexes: IndexObject[]})[],
      enums: dmmf.datamodel.enums,
      datasources: config.datasources,
      generators: config.generators
    };
  } catch (e: any) {
    console.error(
      e,
      `Aurora could not parse the schema at ${filePath}. Please ensure it is of a proper format.`
    );
    throw e;
  }
}
