import {UserResponse} from "./User.interface.ts";

export interface AuthResponse {
  user?: UserResponse;
  accessToken: string;
  refreshToken: string;
}
