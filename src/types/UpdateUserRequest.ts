export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  secondLastName?: string
  isIdentityValidated?: boolean
  identificationNumber?: string
  sisCode?: number
  birthdate?: string
  avatarId?: string
  enabled?: boolean
}