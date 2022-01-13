import fs from 'fs';
import { promisify } from 'util';
import { getDMMF, getConfig, formatSchema } from '@prisma/sdk';
import parseModelFields from './CustomParsers/model-fields';
import parseDatasourceFields from './CustomParsers/datasource-fields';
import parseBlocks from './CustomParsers/parse-blocks';
import { UNSUPPORTED_DATASOURCE_FIELDS } from '../util/CONSTANTS';
import { EnvValue, DataSource, DMMF } from '@prisma/generator-helper';
import type { SchemaInformation } from '../models';
import parseModels from './parseModels';
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
    datamodel = await formatSchema({ schema: datamodel });

    // Grabs the DMMF and Config data using Prisma's SDK
    const dmmf = await getDMMF({ datamodel });
    const config = await getConfig({ datamodel });

    // We need to get some custom values out since DMMF doesn't provide them
    const datasourceBlocksFields: { blockName: string; name: string; value: EnvValue }[][] =
      parseBlocks('datasource', datamodel, parseDatasourceFields);

    // Add any of the unsupported fields to our object
    config.datasources = config.datasources.map((datasource) => {
      const datasourceFields =
        datasourceBlocksFields.find((data) => data[0].blockName == datasource.name) || [];
      return {
        ...datasource,
        ...datasourceFields.reduce((acc, curr) => {
          if (UNSUPPORTED_DATASOURCE_FIELDS.includes(curr.name)) {
            acc[curr.name] = curr.value;
          }
          return acc;
        }, {} as DataSource & { [custom: string]: any })
      };
    });

    // Parses the models manually to grab extra data we need from them that DMMF doesn't provide
    const modelData = parseModels(datamodel);
    const attributeData = parseModelFields(modelData);

    return {
      models: dmmf.datamodel.models.map((model) => {
        model.extendedFields = attributeData[model.name].filter(
          (attribute) => attribute.isFieldAttribute
        );
        model.extendedModelAttributes = attributeData[model.name].filter(
          (attribute) => attribute.isModelAttribute
        );
        return model;
      }) as DMMF.Model[],
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
