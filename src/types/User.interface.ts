import {RoleEnum} from "./enum/Role.enum.ts";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  role: RoleEnum;
  imageUrl: string;
}