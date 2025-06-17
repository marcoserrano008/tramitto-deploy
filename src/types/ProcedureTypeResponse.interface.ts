export interface ProcedureTypeResponse {
  id: number;
  name: string;
  description: string;
  cost: string; // BigDecimal
  active: boolean;
  steps: string[];
  requirements: string[];
  durationDays: number;
  createdAt: string; // ISO string
  updatedAt: string;
  imageId: string;
}
