import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper/dist';
export declare function deserializeModels(models: DMMF.Model[]): Promise<string>;
export declare function deserializeDatasources(datasources: DataSource[]): Promise<string>;
export declare function deserializeGenerators(generators: GeneratorConfig[]): Promise<string>;
export declare function deserializeEnums(enums: DMMF.DatamodelEnum[]): Promise<string>;
