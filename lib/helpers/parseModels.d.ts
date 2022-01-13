import { ModelFields } from '../models';
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like:
 * ```json
 * { "Person": [ { name: 'id', type: 'int', attributes: ['@id'], isModelAttribute: false, isFieldAttribute: true } ] }
 * ```
 */
export default function (datamodel: string): ModelFields;
