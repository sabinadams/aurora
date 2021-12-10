import { parseSchema, getAuroraConfigJSON } from './functions';
import { AuroraConfig, SchemaInformation } from './models';
import type { DMMF } from "@prisma/client/runtime";
import type { DataSource, GeneratorConfig } from "@prisma/generator-helper";
import { ERRORS } from './util/CONSTANTS';

export default async function aurora() {
  // Grab the aurora configuration options from config file
  const config: AuroraConfig = await getAuroraConfigJSON()

  // Parse out the information from each prisma file
  const schemas: SchemaInformation[] = await Promise.all( config.files.map( parseSchema ) )

  // Get a list of all the models
  const models: DMMF.Model[] = schemas.reduce((acc: DMMF.Model[], curr: SchemaInformation) => [...acc, ...curr.models], [])  

  // Mix the models

  // Get all the enums
  const enums: DMMF.DatamodelEnum[] = schemas.reduce((acc: DMMF.DatamodelEnum[], curr: SchemaInformation) => [...acc, ...curr.enums], [])  
  
  // Get all the datasources ( check if multiple non-unique. If so, error )
  let allDatasources: DataSource[] = schemas.reduce((acc: DataSource[], curr: SchemaInformation) => [...acc, ...curr.datasources], [])  
  const datasources = Array.from(new Set(allDatasources))
  if ( datasources.length > 1 ) {
    console.error(
      `There were ${datasources.length} different datasources provided. Make sure all of the datasources are the same.`
    )
    throw new Error(ERRORS.INVALID_SCHEMA)
  }

  // We can now get the singular datasource. Will be funciton call later
  const datasource = datasources[0]

  // Get all the generators (check if multiple non-unique. If so, error )
  let allGenerators: GeneratorConfig[] = schemas.reduce((acc: GeneratorConfig[], curr: SchemaInformation) => [...acc, ...curr.generators], [])  
  const generators = Array.from(new Set(allGenerators))
  if ( generators.length > 1 ) {
    console.error(
      `There were ${generators.length} different generators provided. Make sure all of the generators are the same.`
    )
    throw new Error(ERRORS.INVALID_SCHEMA)
  }

  // We can now get the singular generator. Will be funciton call later
  const generator = generators[0]
}
