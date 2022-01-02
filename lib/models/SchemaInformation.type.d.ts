import type { DMMF } from '@prisma/client/runtime';
import type { DataSource, GeneratorConfig } from '@prisma/generator-helper';
import type { IndexObject } from './';
export declare type SchemaInformation = {
    models: (DMMF.Model & {
        indexes: IndexObject[];
    })[];
    enums: DMMF.DatamodelEnum[];
    datasources: DataSource[];
    generators: GeneratorConfig[];
};
