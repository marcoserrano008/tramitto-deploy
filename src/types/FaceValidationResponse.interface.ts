export interface FaceValidationResponse {
  verified: boolean;
  distance: number;
  threshold: number;
  model: string;
  idNumber: string;
}
