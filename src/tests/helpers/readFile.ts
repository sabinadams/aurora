import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
const readFilePromise = promisify(fs.readFile);

export default async function readFile(filePath: string): Promise<string> {
  return await readFilePromise(path.join(process.cwd(), `./src/tests/${filePath}`), {
    encoding: 'utf-8'
  });
}
