"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATOR_FIELDS = exports.DATASOURCE_FIELDS = exports.UNSUPPORTED_DATASOURCE_FIELDS = exports.VALID_FIELD_KINDS = exports.ERRORS = exports.CONFIG_FILE_NAME = void 0;
exports.CONFIG_FILE_NAME = 'aurora.config.json';
exports.ERRORS = {
    INVALID_CONFIG_FILE: 'Invalid Config File',
    EMPTY_CONFIG_FILES: 'No Schema Files Defined',
    NO_OUTPUT_CONFIGURED: 'No Output Location Provided',
    NON_PRISMA_FILE: 'Non-Prisma file provided',
    INVALID_SCHEMA: 'There was an issue with at least one of your schemas'
};
exports.VALID_FIELD_KINDS = ['scalar', 'object', 'enum'];
exports.UNSUPPORTED_DATASOURCE_FIELDS = ['shadowDatabaseUrl', 'referentialIntegrity'];
exports.DATASOURCE_FIELDS = ['provider', 'url', 'shadowDatabaseUrl', 'referentialIntegrity'];
exports.GENERATOR_FIELDS = [
    'provider',
    'output',
    'binaryTargets',
    'previewFeatures',
    'engineType'
];
