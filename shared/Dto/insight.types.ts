import type { InsightTypes } from "@shared/types";

export interface updateInsightDto {
  id: string;
  updates: {
    title: string;
    description: string;
    type: InsightTypes;
  };
}
