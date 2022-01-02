import { ModelMapping } from '../models';
/**
 *
 * @param datamodel The datamodel string
 * @returns An object like { User: { firstName: 'first_name' } }
 */
export default function (datamodel: string): {
    [K: string]: ModelMapping;
};
