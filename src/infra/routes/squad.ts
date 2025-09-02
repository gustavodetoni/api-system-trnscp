import { Elysia, t } from 'elysia'
import { requireDataAccess } from '../../shared/auth/require-data-access'
import { CreateSquadUseCase } from '../../core/use-cases/squad/create-squad'
import { FetchSquadsUseCase } from '../../core/use-cases/squad/fetch-squad'
import { GetSquadUseCase } from '../../core/use-cases/squad/get-squad'
import { UpdateSquadUseCase } from '../../core/use-cases/squad/update-squad'
import { DeleteSquadUseCase } from '../../core/use-cases/squad/delete-squad'
import { DrizzleSquadRepository } from '../repositories/squad-repository'
import { db } from '../database/drizzle'
import { userSquads } from '../database/schema'
import { and, eq } from 'drizzle-orm'
import { Conflict } from '../../shared/errors/conflict'

const squadRepository = new DrizzleSquadRepository()

export const squadRoutes = new Elysia({
  name: 'routes:squads',
  prefix: '/squads'
})
  .use(requireDataAccess())
  .get(
    '/',
    async ({ query: { page, pageSize, search }, isAdmin, currentUserId }) => {
      const fetchSquadsUseCase = new FetchSquadsUseCase(squadRepository)
      return await fetchSquadsUseCase.execute({
        search,
        page,
        pageSize,
        userId: currentUserId,
        isAdmin
      })
    },
    {
      detail: { tags: ['Squad'] },
      query: t.Object({
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
        search: t.Optional(t.String())
      })
    }
  )
  .get(
    '/:id',
    async ({ params, isAdmin, currentUserId }) => {
      const getSquadUseCase = new GetSquadUseCase(squadRepository)
      return await getSquadUseCase.execute({
        id: params.id,
        userId: currentUserId,
        isAdmin
      })
    },
    {
      detail: { tags: ['Squad'] },
      params: t.Object({
        id: t.String()
      })
    }
  )
  .group('', (app) =>
    app
      .use(requireDataAccess('SUPERVISOR'))
      .post(
        '/',
        async ({ body }) => {
          const createSquadUseCase = new CreateSquadUseCase(squadRepository)
          return await createSquadUseCase.execute({
            name: body.name,
            description: body.description,
            language: body.language
          })
        },
        {
          detail: { tags: ['Squad'] },
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
            language: t.String(),
            memberUserIds: t.Optional(t.Array(t.String()))
          })
        }
      )
      .put(
        '/:id',
        async ({ params, body }) => {
          const updateSquadUseCase = new UpdateSquadUseCase(squadRepository)
          return await updateSquadUseCase.execute({
            id: params.id,
            name: body.name,
            description: body.description,
            language: body.language
          })
        },
        {
          detail: { tags: ['Squad'] },
          params: t.Object({
            id: t.String()
          }),
          body: t.Partial(
            t.Object({
              name: t.String(),
              description: t.Optional(t.String()),
              language: t.String()
            })
          )
        }
      )
      .delete(
        '/:id',
        async ({ params }) => {
          const deleteSquadUseCase = new DeleteSquadUseCase(squadRepository)
          return await deleteSquadUseCase.execute({ id: params.id })
        },
        {
          detail: { tags: ['Squad'] },
          params: t.Object({
            id: t.String()
          })
        }
      )
      .post(
        '/:id/members',
        async ({ params, body }) => {
          const values = body.userIds.map((uid) => ({
            userId: uid,
            squadId: params.id
          }))
          try {
            await db.insert(userSquads).values(values)
          } catch {
            throw new Conflict('Some membership already exists')
          }
          return { ok: true }
        },
        {
          detail: { tags: ['Squad'] },
          params: t.Object({
            id: t.String()
          }),
          body: t.Object({
            userIds: t.Array(t.String())
          })
        }
      )
      .delete(
        '/:id/members/:userId',
        async ({ params }) => {
          await db
            .delete(userSquads)
            .where(
              and(
                eq(userSquads.userId, params.userId),
                eq(userSquads.squadId, params.id)
              )
            )
          return { ok: true }
        },
        {
          detail: { tags: ['Squad'] },
          params: t.Object({
            id: t.String(),
            userId: t.String()
          })
        }
      )
  )
