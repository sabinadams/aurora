import type { SchemaInformation } from '../models';
/**
 *
 * @param filePath Path to the Prisma file we are parsing
 */
export declare function parseSchema(filePath: string): Promise<SchemaInformation>;
