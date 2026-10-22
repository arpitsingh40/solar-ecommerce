export type UserRole = "customer" | "admin" | "supplier"

export interface PublicUser {
  id: string
  email: string
  name: string
  companyName?: string
  role: UserRole
  avatar?: string
  phone?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
