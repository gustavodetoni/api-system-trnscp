export type User = {
  id: string
  name: string
  email: string
  password: string
  role: 'VIEWER' | 'ADMIN' | 'ANALYST' | 'MEMBER' | 'SUPERVISOR'
  plan: 'FREE' | 'PREMIUM' | 'CUSTOM'
}
