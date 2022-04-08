import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
export declare function renderDatasources(datasources: DataSource[]): string;
export declare function renderGenerators(generators: GeneratorConfig[]): string;
export declare function renderModels(models: DMMF.Model[]): string;
export declare function renderEnums(enums: DMMF.DatamodelEnum[]): string;
