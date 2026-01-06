import type { InsightTypes } from "../types";

export interface updateInsightDto {
  id: string;
  updates: {
    title: string;
    description: string;
    type: InsightTypes;
  };
}
