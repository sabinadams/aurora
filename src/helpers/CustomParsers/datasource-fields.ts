import { EnvValue } from '@prisma/generator-helper';

export default function parseDatasourceFields(blockName: string, lines: string[]) {
  return lines.map((line: string) => {
    let lineData: { blockName: string; name: string; value: EnvValue } = {
      blockName: blockName,
      name: '',
      value: { fromEnvVar: '', value: '' }
    };
    let [name, value] = line.split(' = ');
    lineData['name'] = name;
    if (value.indexOf('env(') > -1) {
      lineData['value'] = {
        fromEnvVar: value.split('env(')[1].split(')')[0].split('"')[1],
        value: ''
      };
    } else {
      lineData['value'] = {
        fromEnvVar: null,
        value: value.split('"')[1]
      };
    }
    return lineData;
  });
}
