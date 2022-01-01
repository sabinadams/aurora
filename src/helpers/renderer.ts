import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
import { VALID_FIELD_KINDS } from '../util/CONSTANTS';

/**
 *
 * @param type Prisma block's type
 * @param name Prisma block's name
 * @param items Block's inner items
 * @returns A generated Prisma Schema block
 */
function renderBlock(type: string, name: string, items: string[]): string {
  return `${type} ${name} {\n${items
    .filter((item) => item.length > 1)
    .map((item) => `\t${item}`)
    .join('\n')}\n}`;
}

/**
 *
 * @param name Name of the attribute
 * @param value Value of the attribute
 * @param options Options defining whether or not to wrap the value in quotes and/or env()
 * @returns A generated attribute line (e.g. output = "/some/location/schema.prisma")
 */
function renderAttribute(
  name: string,
  value: string | undefined | null,
  options: {
    env?: boolean;
    quotes?: boolean;
  } = {
    env: false,
    quotes: false
  }
): string {
  // If we don't have a value, don't generate a line
  if (!value?.length) return '';

  // Optionally wrap the value in quotes
  if (options?.quotes || options?.env) value = `"${value}"`;
  // Handle scenario where value comes from the environment
  if (options?.env) value = `env(${value})`;

  return `${name} = ${value}`;
}

/**
 *
 * @param field The Prisma Field we are generating the relation line for
 * @returns the Relation definition (e.g. @relation(name: "PostToUser"))
 */
function renderFieldRelation(field: DMMF.Field): string {
  return field.relationFromFields && field.relationFromFields.length > 0
    ? `@relation(name: "${field.relationName}", fields: [${field.relationFromFields}], references: [${field.relationToFields}])`
    : `@relation(name: "${field.relationName}")`;
}

/**
 *
 * @param field The Prisma Field with a default attribute
 * @returns the Default definition (e.g. @default(autoincrement()))
 */
function renderDefaultAttribute(field: DMMF.Field): string {
  // If the default value isn't available, do nothing
  if (field.default == null || field.default === undefined) return '';
  let defaultString: any;
  // We've got ourselves a function! Handle it properly
  if (typeof field.default === 'object') {
    defaultString = `${field.default.name}(${field.default.args})`;
  }
  // This is a normal value.
  else {
    defaultString = field?.default;
    // If this is a value that should be wrapped in quotes, do so
    if (field.kind === 'scalar' && field.type !== 'BigInt' && typeof field.default == 'string')
      defaultString = `"${defaultString}"`;
  }

  return `@default(${defaultString})`;
}

/**
 *
 * @param field The Prisma Field we are generating a line
 * @returns The generated Field line for a Model block
 */
function renderField(field: DMMF.Field): string {
  // If the field's "kind" isn't valid, throw error
  if (!VALID_FIELD_KINDS.includes(field.kind))
    throw new Error(`Unsupported field kind "${field.kind}"`);

  // Initialize the line with the field name and type
  let fieldString = `${field.name} ${field.type}`;

  // If this is a list field, signify that on the line
  if (field.isList) fieldString = `${fieldString}[]`;
  // If this is not a list field, and it isn't required or it is an enum/object, signify that it is optional in the line
  else if (!field.isRequired || ['enum', 'object'].includes(field.kind))
    fieldString = `${fieldString}?`;

  // The remaining field attributes are self-explanatory
  if (field.isId) fieldString = `${fieldString} @id`;

  if (field.isUnique) fieldString = `${fieldString} @unique`;

  if (field.isUpdatedAt) fieldString = `${fieldString} @updatedAt`;

  if (field?.columnName?.length) fieldString = `${fieldString} @map("${field.columnName}")`;

  if (field.hasDefaultValue) fieldString = `${fieldString} ${renderDefaultAttribute(field)}`;

  if (field.relationName) fieldString = `${fieldString} ${renderFieldRelation(field)}`;

  return fieldString;
}

/**
 *
 * @param uniqueField Array of strings that hold the field names for the unique field
 * @returns The generated Unique line for a model (e.g. @@unique([id, otherId])) )
 */
function renderUniqueField(uniqueField: string[]): string {
  return `@@unique([${uniqueField.join(', ')}])`;
}

/**
 *
 * @param indexes Array of strings that hold the field names the indexed fields
 * @returns The generated index line for a model (e.g. @@index([someId, otherId])) )
 */
function renderIndex( index: DMMF.uniqueIndex): string {
  return index?.name?.length ?
    `@@index( name: "${index.name}", [${index.fields.join(', ')}])`
    : `@@index([${index.fields.join(', ')}])`
}

/**
 *
 * @param fields Fields in the ID definition
 * @returns The generated ID definition for a model. (e.g. @@id([id, otherId]))
 */
function renderIdOrPk(fields: string[]): string {
  return fields.length ? `@@id([${fields.join(', ')}])` : '';
}

/**
 *
 * @param datasources A list of Prisma Datasources
 * @returns string with rendered Datasource Blocks
 */
export function renderDatasources(datasources: DataSource[]): string {
  return datasources
    .map(({ activeProvider, name, url: config }) => {
      return renderBlock('datasource', name, [
        renderAttribute('provider', activeProvider, { quotes: true }),
        renderAttribute('url', config.fromEnvVar ? config.fromEnvVar : config.value, {
          env: config.fromEnvVar ? true : false,
          quotes: true
        })
      ]);
    })
    .join('\n');
}

/**
 *
 * @param generators A list of Prisma Generators
 * @returns string with rendered Generator Blocks
 */
export function renderGenerators(generators: GeneratorConfig[]): string {
  return generators
    .map((generator) => {
      return renderBlock('generator', generator.name, [
        renderAttribute('provider', generator.provider.value, { quotes: true }),
        renderAttribute(
          'output',
          generator?.output?.fromEnvVar ? generator.output.fromEnvVar : generator?.output?.value,
          { env: generator?.output?.fromEnvVar ? true : false, quotes: true }
        ),
        renderAttribute(
          'binaryTargets',
          generator.binaryTargets.length
            ? JSON.stringify(generator.binaryTargets as unknown as String[])
            : null
        ),
        renderAttribute(
          'previewFeatures',
          generator.previewFeatures.length ? JSON.stringify(generator.previewFeatures) : null
        )
      ]);
    })
    .join('\n');
}

/**
 *
 * @param models A list of Prisma Models
 * @returns string with rendered Model Blocks
 */
export function renderModels(models: DMMF.Model[]): string {
  // Need to also render unique fields
  return models
    .map((model) => {
      let items = model.fields.map(renderField);

      // Unique fields
      items.push(...model.uniqueFields.map(renderUniqueField));

      // Indexes
      items.push(...model.indexes.map(renderIndex))

      // If there is a table name mapping, add it
      if (model?.dbName?.length) items.push(`@@map("${model.dbName}")`);

      // ID/PK  ( idFields is backwards compatibility for prisma versions below v.2.30.0)
      if (model.idFields || model.primaryKey)
        items.push(renderIdOrPk(model?.idFields || model?.primaryKey?.fields));

      return renderBlock('model', model.name, items);
    })
    .join('\n');
}

/**
 *
 * @param enums A list of Prisma Enums
 * @returns string with rendered Enum Blocks
 */
export function renderEnums(enums: DMMF.DatamodelEnum[]): string {
  return enums
    .map(({ name, values }) => {
      return renderBlock(
        'enum',
        name,
        values.map(({ name, dbName }) => {
          let record = name;
          // If there is a name mapping, add it
          if (dbName && name !== dbName) {
            record = `${record} @map("${dbName}")`;
          }
          return record;
        })
      );
    })
    .join('\n');
}
