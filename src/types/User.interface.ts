import {RoleEnum} from "./enum/Role.enum.ts";

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  role: RoleEnum;
}
