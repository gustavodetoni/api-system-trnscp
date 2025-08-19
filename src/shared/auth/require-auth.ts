import { Elysia } from 'elysia'
import { Forbidden } from '../errors/forbidden'
import { authPlugin } from './auth'

const order = ['VIEWER', 'MEMBER', 'ANALYST', 'SUPERVISOR', 'ADMIN'] as const
type Role = (typeof order)[number]

export const requireRole = (min?: Role | Role[]) =>
  new Elysia({ name: 'require-role' })
    .use(authPlugin)
    .onBeforeHandle(({ user }) => {
      if (!user?.role) throw new Forbidden('Missing user/role')

      if (!min) return
      const need = Array.isArray(min) ? min : [min]

      const userIdx = order.indexOf(user.role)

      const response = need.some((r) => userIdx >= order.indexOf(r))
      if (!response) throw new Forbidden('Insufficient role')
    })
    .as('scoped')
