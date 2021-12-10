import { parseSchema, getAuroraConfigJSON } from './functions';
import path from 'path';
import { AuroraConfig, SchemaInformation } from './models';

export default async function aurora() {
  // Grab the aurora configuration options from config file
  const config: AuroraConfig = await getAuroraConfigJSON()

  // Parse out the information from each prisma file
  const schemaConfigs: SchemaInformation[] = await Promise.all( config.files.map( parseSchema ))

}
