import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
/**
 *
 * @param datasources A list of Prisma Datasources
 * @returns string with rendered Datasource Blocks
 */
export declare function renderDatasources(datasources: DataSource[]): string;
/**
 *
 * @param generators A list of Prisma Generators
 * @returns string with rendered Generator Blocks
 */
export declare function renderGenerators(generators: GeneratorConfig[]): string;
/**
 *
 * @param models A list of Prisma Models
 * @returns string with rendered Model Blocks
 */
export declare function renderModels(models: DMMF.Model[]): string;
/**
 *
 * @param enums A list of Prisma Enums
 * @returns string with rendered Enum Blocks
 */
export declare function renderEnums(enums: DMMF.DatamodelEnum[]): string;
