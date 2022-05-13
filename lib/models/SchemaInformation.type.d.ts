import type { DataSource, GeneratorConfig, DMMF } from '@prisma/generator-helper';
export declare type SchemaInformation = {
    models: DMMF.Model[];
    enums: DMMF.DatamodelEnum[];
    datasources: DataSource[];
    generators: GeneratorConfig[];
};
