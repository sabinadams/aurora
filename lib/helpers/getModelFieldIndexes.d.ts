import { IndexObject } from '../models';
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like [{ name: 'firstName_lastName', fields: ['firstName', 'lastName'] }]
 */
export default function (datamodel: string): {
    [K: string]: IndexObject[];
};
