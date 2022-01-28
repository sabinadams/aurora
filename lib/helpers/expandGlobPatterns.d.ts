import type { AuroraConfig } from '../models';
/**
 * Check for glob patterns in `config.files`, evaluate them and expand them to actual files
 *
 * @param config The Configuration object to expand
 * @returns AuroraConfig
 * @throws Exception if it fails to traverse the filesystem
 */
export declare const expandGlobPatterns: (config: AuroraConfig) => Promise<AuroraConfig>;
