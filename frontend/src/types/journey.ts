export interface Journey {
  id: string;
  name: string;
  steps: Step[];
}

export interface Step {
  name: string;
  description: string;
  img: string;
  attributes: {
    pains: string;
    insights: string;
    services: string;
  };
}
