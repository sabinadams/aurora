declare type BlockCallback = ((name: string, lines: string[], type: string) => any) | null;
export default function parseBlocks(blockType: string, schema: string, handler?: BlockCallback): any[];
export {};
