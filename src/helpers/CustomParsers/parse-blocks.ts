type BlockCallback = ((name: string, lines: string[], type: string) => any) | null;

export default function parseBlocks(
  blockType: string,
  schema: string,
  handler: BlockCallback = null
) {
  // If no handler was passed, just return all the data
  if (!handler) handler = (name: string, lines: string[], type: string) => ({ name, lines, type });

  const datasourceChunk = schema
    .split('}')
    .filter((chunk) => chunk.trim().indexOf(blockType) === 0);

  return datasourceChunk.map((blockChunk) => {
    // Split the model chunk by line to get the individual fields
    // The first line will have a model name which we will pull out later
    let pieces = blockChunk
      .split('\n')
      .filter((chunk) => chunk.trim().length)
      .map((chunk) => chunk.trim())
      .map((chunk) => chunk.replace(/\s+/g, ' '));

    // Pass the data into whatever handler was passed
    return handler ? handler(pieces[0].split(' ')[1], pieces.slice(1), blockType) : null;
  });
}
