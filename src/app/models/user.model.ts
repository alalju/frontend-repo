export interface User {
  id: number
  name: string
  email: string
  role: "student" | "works-admin" | "users-admin"
  career?: string
  status: "active" | "inactive" | "blocked"
  lastLogin: string
  createdAt: Date
}

export interface UserStats {
  total: number
  students: number
  admins: number
  newToday: number
}
