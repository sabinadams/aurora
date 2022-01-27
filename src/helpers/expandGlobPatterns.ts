import { promisify } from 'util';
import globMod from 'glob';
import type { AuroraConfig } from '../models';
import { CONFIG_FILE_NAME } from '../util/CONSTANTS';

const glob = promisify(globMod);
/**
 * Check for glob patterns in `config.files`, evaluate them and expand them to actual files
 *
 * @param config The Configuration object to expand
 * @returns AuroraConfig
 * @throws Exception if it fails to traverse the filesystem
 */
export const expandGlobPatterns = async (config: AuroraConfig): Promise<AuroraConfig> => {
  try {
    let result: AuroraConfig = { files: [], output: config.output };

    for (let f in config.files) {
      const file = config.files[f];
      result.files = result.files.concat(await _expandIfGlob(file));
    }

    return result;
  } catch (e) {
    console.error(
      `Aurora could not parse GLOB patterns in ${CONFIG_FILE_NAME} 'file' section. Please make sure these files exists and the GLOB pattern is valid.`
    );
    throw e;
  }
};

const _expandIfGlob = async (file: string): Promise<string[]> =>
  globMod.hasMagic(file) ? await glob(file, { nonull: true }) : [file];
