import { Elysia } from 'elysia'
import { authPlugin } from './auth'
import { Forbidden } from '../errors/forbidden'

const order = ['VIEWER', 'MEMBER', 'ANALYST', 'SUPERVISOR', 'ADMIN']
type Role = (typeof order)[number]

export const requireDataAccess = (role?: Role | Role[]) =>
  new Elysia({ name: 'require-data-access' })
    .use(authPlugin)
    .onBeforeHandle(({ user }) => {
      if (!user?.role || !user?.sub) {
        throw new Forbidden('Not authenticated')
      }

      if (user.role === 'VIEWER') {
        throw new Forbidden('Viewer not allowed')
      }

      if (!role) {
        return
      }

      const need = Array.isArray(role) ? role : [role]
      const userRoleIndex = order.indexOf(user.role)
      const hasPermission = need.some((r) => userRoleIndex >= order.indexOf(r))

      if (!hasPermission) {
        throw new Forbidden('Insufficient role')
      }
    })
    .derive(({ user }) => ({
      isAdmin: user?.role === 'ADMIN',
      currentUserId: user?.sub,
      userRole: user?.role
    }))
    .as('scoped')