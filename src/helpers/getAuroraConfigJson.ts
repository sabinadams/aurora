import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import type { AuroraConfig } from '../models';
import { CONFIG_FILE_NAME, ERRORS } from '../util/CONSTANTS';

const readFile = promisify(fs.readFile);

/**
 *
 * @returns The configuration JSON object from the aurora configuration file
 */
export async function getAuroraConfigJSON(): Promise<AuroraConfig> {
  try {
    // Read the JSON
    const jsonString = await readFile(path.join(process.cwd(), CONFIG_FILE_NAME), {
      encoding: 'utf-8'
    });

    const config: AuroraConfig = JSON.parse(jsonString);

    // Ensure all of the fields were provided and are valid
    validateConfigurationObject(config);

    return JSON.parse(jsonString);
  } catch (e) {
    console.error(
      `Aurora could not load ${CONFIG_FILE_NAME}. Please make sure this file exists and is valid.`
    );
    throw e;
  }
}

/**
 *
 * @param config The Configuration object to validate
 * @description Throws errors if anything is invalid
 */
const validateConfigurationObject = (config: AuroraConfig) => {
  if (!Object.keys(config)) {
    console.error(
      `Your ${CONFIG_FILE_NAME} is invalid or empty. Please make sure this file exists and is valid.`
    );
    throw new Error(ERRORS.INVALID_CONFIG_FILE);
  }

  if (!config?.files?.length) {
    console.error(
      `No Prisma Files provided. Please specify at least one prisma schema file to process.`
    );
    throw new Error(ERRORS.EMPTY_CONFIG_FILES);
  }

  if (config.files.filter((file) => !file.includes('.prisma')).length) {
    console.error(`Invalid File. Only provide paths to .prisma files.`);
    throw new Error(ERRORS.NON_PRISMA_FILE);
  }

  if (!config?.output?.length) {
    console.error(`No Output location. Please specify where to output the generated file.`);
    throw new Error(ERRORS.NO_OUTPUT_CONFIGURED);
  }

  if (!config.output.includes('.prisma')) {
    console.error(`The Output file should have the .prisma extension.`);
    throw new Error(ERRORS.NON_PRISMA_FILE);
  }
};
