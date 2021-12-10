import fs from "fs";
import { promisify } from "util";
import { getDMMF, getConfig } from "@prisma/sdk";
import type { DMMF } from "@prisma/client/runtime";
import type { SchemaInformation } from "../models";
import path from "path";
const readFile = promisify(fs.readFile);

/**
 *
 * @param filePath Path to the Prisma file we are parsing
 */
export async function parseSchema(
  filePath: string
): Promise<SchemaInformation> {
  try {
    const datamodel = await readFile(path.join(process.cwd(), filePath), {
      encoding: 'utf-8',
    });

    const dmmf = await getDMMF({ datamodel });
    const config = await getConfig({ datamodel });

    return {
      models: dmmf.datamodel.models as DMMF.Model[],
      enums: dmmf.datamodel.enums,
      datasources: config.datasources,
      generators: config.generators,
    };
  } catch (e: any) {
    console.error(
      `Aurora could not parse the schema at ${filePath}. Please ensure it is of a proper format.`
    );
    throw e;
  }
}
