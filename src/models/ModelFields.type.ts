type ModelLine = {
  name?: string;
  type?: string;
  attributes: string[];
  isModelAttribute: boolean;
  isFieldAttribute: boolean;
};

export type ModelFields = {
  [K: string]: ModelLine[];
};
