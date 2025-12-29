export interface Dimension {
  slug: string;
  name: string;
  description: string;
  type: "Text" | "Number" | "Image";
}

export interface Step {
  id: string;
  name: string;
  description: string;
  imageId?: string;
  attributes: Record<Dimension["slug"], string>;
}

export interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Insight {
  id: string;
  title: string;
  description?: string;
  type: "pain" | "gain" | "need" | "observation";
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
