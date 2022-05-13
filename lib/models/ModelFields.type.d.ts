declare type ModelLine = {
    name?: string;
    type?: string;
    attributes: string[];
    isModelAttribute: boolean;
    isFieldAttribute: boolean;
};
export declare type ModelFields = {
    [K: string]: ModelLine[];
};
export {};
