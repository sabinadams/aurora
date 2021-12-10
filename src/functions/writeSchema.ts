import path from "path";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export async function writeSchema( filePath: string, schema: string ) {
    await writeFile(path.join(process.cwd(), filePath), schema);
}