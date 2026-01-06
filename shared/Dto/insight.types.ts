import type { InsightTypes } from "../types";

export interface createInsightDto {
  title: string;
  description?: string;
  type: InsightTypes;
}

export interface updateInsightDto {
  id: string;
  updates: {
    title?: string;
    description?: string;
    type?: InsightTypes;
  };
}
