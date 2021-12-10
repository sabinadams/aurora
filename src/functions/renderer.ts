import {
  ConnectorType,
  DataSource,
  DMMF,
  EnvValue,
  GeneratorConfig,
} from "@prisma/generator-helper";

function renderBlock(type: string, name: string, items: string[]): string {
  return `${type} ${name} {\n${items
    .filter((item) => item.length > 1)
    .map((item) => `\t${item}`)
    .join("\n")}\n}`;
}

function renderAttribute(
  name: string,
  value: string | undefined | null,
  options: {
    env?: boolean;
    quotes?: boolean;
  } = {
    env: false,
    quotes: false,
  }
): string {
  if (!value?.length) return "";

  if (options?.quotes || options?.env) value = `"${value}"`;
  if (options?.env) value = `env(${value})`;
  return `${name} = ${value}`;
}

function renderFieldRelation(
    field: DMMF.Field
): string {
   return field.relationFromFields.length > 0
        ? ` @relation(name: "${field.relationName}", fields: [${field.relationFromFields}], references: [${field.relationToFields}])`
        : ` @relation(name: "${field.relationName}")`;
}

function renderDefaultAttribute(
    field: DMMF.Field
): string {
    if ( field.default == null || field.default === undefined ) return ''
    let defaultString: any;
    if (typeof field.default === 'object') {
        defaultString = `${field.default.name}(${field.default.args})`;
    } else {
        defaultString = field?.default;
        if (field.kind === 'scalar' && field.type !== 'BigInt' && typeof field.default == 'string') defaultString = `"${defaultString}"`;
    }

    return `@default(${defaultString})`
}

function renderField(
    field: DMMF.Field
): string {
    const validKinds = ['scalar', 'object', 'enum']
    if ( !validKinds.includes(field.kind))
        throw new Error(`Unsupported field kind "${field.kind}"`);

    let fieldString = `${field.name} ${field.type}`

    if ( field.isList ) {
        fieldString = `${fieldString}[]`
    } else if ( field.isRequired || ['enum', 'object'].includes(field.kind) ) {
        fieldString = `${fieldString}?`
    }
    
    if ( field.isId ) {
        fieldString = `${fieldString} @id`
    }

    if ( field.isUnique ) {
        fieldString = `${fieldString} @unique`
    }

    if ( field.isUpdatedAt ) {
        fieldString = `${fieldString} @updatedAt`
    }

    if ( field?.columnName?.length ) {
        fieldString = `${fieldString} @map("${field.columnName}")`
    }
    if ( field.hasDefaultValue ) {
        fieldString = `${fieldString} ${renderDefaultAttribute( field )}`
    }
    if (field.relationName) {
        fieldString = `${fieldString} ${renderFieldRelation(field)}`
    }

    return fieldString
}

export function renderDatasources(datasources: DataSource[]): string {
  return datasources
    .map(({ activeProvider, name, url: config }) => {
      return renderBlock("datasource", name, [
        renderAttribute("provider", activeProvider, { quotes: true }),
        renderAttribute(
          "url",
          config.fromEnvVar ? config.fromEnvVar : config.value,
          { env: config.fromEnvVar ? true : false, quotes: true }
        ),
      ]);
    })
    .join("\n");
}

export function renderGenerators(generators: GeneratorConfig[]): string {
  return generators
    .map((generator) => {
      return renderBlock("generator", generator.name, [
        renderAttribute("provider", generator.provider.value, { quotes: true }),
        renderAttribute(
          "output",
          generator?.output?.fromEnvVar
            ? generator.output.fromEnvVar
            : generator?.output?.value,
          { env: generator?.output?.fromEnvVar ? true : false, quotes: true }
        ),
        renderAttribute(
          "binaryTargets",
          generator.binaryTargets.length ? JSON.stringify(generator.binaryTargets as unknown as String[]): null
        ),
        renderAttribute(
          "previewFeatures",
          generator.previewFeatures.length ? JSON.stringify(generator.previewFeatures) : null
        ),
      ]);
    })
    .join("\n");
}

export function renderModels(models: DMMF.Model[]): string {
  return models
    .map( model => {
      let items = [];
      // fields
      const fields = model.fields.map(renderField);

      items.push(...fields)
      //dbname
      if (model?.dbName?.length) items.push(`@@map("${model.dbName}")`);

      return renderBlock("model", model.name, items);
    })
    .join("\n");
}

export function renderEnums( enums: DMMF.DatamodelEnum[] ): string {
    return enums.map( ({name, values, dbName }) => {
        return renderBlock('enum', name, [
            ...values.map(({ name, dbName }) => {
                let record = name
                if ( dbName && name !== dbName ) {
                    record = `${record} @map("${dbName}")`
                }
                return record
            })
        ])
    }).join('\n')
}