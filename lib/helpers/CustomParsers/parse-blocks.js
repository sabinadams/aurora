"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBlocks(blockType, schema, handler) {
    if (handler === void 0) { handler = null; }
    if (!handler)
        handler = function (name, lines, type) { return ({ name: name, lines: lines, type: type }); };
    var datasourceChunk = schema
        .split('}')
        .filter(function (chunk) { return chunk.trim().indexOf(blockType) === 0; });
    return datasourceChunk.map(function (blockChunk) {
        var pieces = blockChunk
            .split('\n')
            .filter(function (chunk) { return chunk.trim().length; })
            .map(function (chunk) { return chunk.trim(); })
            .map(function (chunk) { return chunk.replace(/\s+/g, ' '); });
        return handler ? handler(pieces[0].split(' ')[1], pieces.slice(1), blockType) : null;
    });
}
exports.default = parseBlocks;
