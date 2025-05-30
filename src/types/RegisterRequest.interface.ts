export interface RegisterRequest {
  firstName: string;
  lastName: string;
  secondLastName: string;
  email: string;
  password: string;
  identificationNumber: string;
  isIdentityValidated: boolean;
  sisCode: number;
  birthdate: string;
}
