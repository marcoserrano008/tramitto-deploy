import {User} from "./User.interface.ts";

export interface AuthResponse {
  user?: User;
  accessToken: string;
  refreshToken: string;
}
