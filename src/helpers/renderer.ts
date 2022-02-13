import { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';

/**
 *
 * @param type Prisma block's type
 * @param name Prisma block's name
 * @param items Block's inner items
 * @returns A generated Prisma Schema block
 */
function renderBlock(type: string, name: string, items: string[]): string {
  return `${type} ${name} {\n${items
    .filter((item) => item.length >= 1)
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
 * @param fields A list of fields from a generator or datasource
 * @returns A rendered attribute block
 */
function renderConfigFields(fields: any) {
  return (
    Object.keys(fields)
      // Don't care about the name field
      .filter((key) => key !== 'name')
      // Make sure the key isn't null
      .filter((key) => fields[key])
      .map((field) => {
        let value = '';
        let isEnvVar = false;

        // If it's a string, that should be our value
        if (typeof fields[field] == 'string') {
          value = fields[field];
          // If it's an array, go through the array
        } else if (Array.isArray(fields[field]) && fields[field].length) {
          value = `[${fields[field]
            .map((val: any) => {
              let fieldIsEnvVar = false;
              if (typeof val == 'string') {
                val = `"${val}"`;
              } else {
                fieldIsEnvVar = val.fromEnvVar ? true : false;
                val = fieldIsEnvVar ? `env("${val.fromEnvVar}")` : `"${val.value}"`;
              }
              return val;
            })
            .join(',')}]`;
          // It must be an env var object. Get the data
        } else {
          isEnvVar = fields[field].fromEnvVar ? true : false;
          value = isEnvVar ? fields[field].fromEnvVar : fields[field].value;
        }

        // Render the attribute and return it
        return renderAttribute(field, value, {
          env: isEnvVar,
          quotes: !isEnvVar && !Array.isArray(fields[field])
        });
      })
  );
}

/**
 *
 * @param datasources A list of Prisma Datasources
 * @returns string with rendered Datasource Blocks
 */
export function renderDatasources(datasources: DataSource[]): string {
  return datasources
    .map((datasource: any) => {
      // Fix naming differences
      datasource['provider'] = datasource.activeProvider;

      // Render the block
      return renderBlock('datasource', datasource.name, renderConfigFields(datasource));
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
    .map((generator: any) => {
      generator = {
        ...generator,
        ...generator.config
      };

      return renderBlock('generator', generator.name, renderConfigFields(generator));
    })
    .join('\n');
}

function renderModelField(field: DMMF.Field) {
  const pieces = [
    field.name,
    `${field.type}${field.optional ? '?' : ''}${field.scalar ? '[]' : ''}`,
    field.attributes.join(' ')
  ];

  return pieces.join(' ');
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
      let items = model.extendedFields.map(renderModelField);
      items.push(...model.extendedModelAttributes);

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
