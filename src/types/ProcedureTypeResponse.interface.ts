export interface ProcedureTypeResponse {
  id: number;
  name: string;
  description: string;
  cost: string; // BigDecimal
  isActive: boolean;
  steps: string[];
  requirements: string[];
  durationDays: number;
  createdAt: string; // ISO string
  updatedAt: string;
}
