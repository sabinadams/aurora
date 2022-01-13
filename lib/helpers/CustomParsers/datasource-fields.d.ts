import { EnvValue } from '@prisma/generator-helper';
export default function parseDatasourceFields(blockName: string, lines: string[]): {
    blockName: string;
    name: string;
    value: EnvValue;
}[];
