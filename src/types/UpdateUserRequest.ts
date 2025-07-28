export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  secondLastName?: string
  isIdentityValidated?: boolean
  sisCode?: number
  birthdate?: string // ISO date string
  avatarId?: string
}