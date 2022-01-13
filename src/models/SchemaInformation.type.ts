import type { DataSource, GeneratorConfig, DMMF } from '@prisma/generator-helper';

export type SchemaInformation = {
  models: DMMF.Model[];
  enums: DMMF.DatamodelEnum[];
  datasources: DataSource[];
  generators: GeneratorConfig[];
};
