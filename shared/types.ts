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
  img: string;
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
