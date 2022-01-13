export type ModelAttribute = {
  default: string | null;
  attributeType: string;
  fields: string[] | null;
  references: string[] | null;
  value: string | null;
  map: string | null;
  name: string | null;
  length: string | null;
  sort: string | null;
  onUpdate: string | null;
  onDelete: string | null;
};

type ModelLine = {
  name?: string;
  type?: string;
  attributes: string[];
  isModelAttribute: boolean;
  isFieldAttribute: boolean;
  attributesFixed: ModelAttribute[];
};

export type ModelFields = {
  [K: string]: ModelLine[];
};
