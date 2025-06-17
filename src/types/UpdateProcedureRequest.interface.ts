export interface UpdateProcedureTypeRequest {
  name?: string; // max 100 characters
  description?: string;
  cost?: number; // > 0, max 8 integer digits, 2 decimal places
  imageId?: string;
  steps?: string[];
  requirements?: string[];
  durationDays?: number; // >= 1
}
