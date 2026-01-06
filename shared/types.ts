export interface Dimension {
  slug: string;
  name: string;
  description: string;
  type: "Text" | "Number" | "Image";
}

export interface Step {
  id: string;
  name: string;
  journeyId: string;
  description: string;
  imageId?: string;
  attributes: Record<
    Dimension["slug"],
    { id: string; title: string }[] | string
  >;
}

export interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  personas: {
    slug: string;
    name: string;
  }[];
}

export interface Connection {
  id: string;
  stepId: string;
  attributeId: string;
  attributeType: "insight" | "service";
  createdAt: string;
  deletedAt?: string;
}

export const insightTypes = ["pain", "gain", "need", "observation"] as const;

export type InsightTypes = (typeof insightTypes)[number];

export interface Insight {
  id: string;
  title: string;
  description?: string;
  type: InsightTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Persona {
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
