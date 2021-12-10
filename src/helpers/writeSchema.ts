import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

/**
 *
 * @param filePath Path to the output file
 * @param schema Generated Prisma Schema string
 */
export async function writeSchema(filePath: string, schema: string) {
  await writeFile(path.join(process.cwd(), filePath), schema);
}
