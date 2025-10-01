import {RoleEnum} from "./enum/Role.enum.ts";

export interface UsersByRoleAndEnabledRequest {
  enabled?: boolean;

  role?: RoleEnum;
}
