import { Elysia, t } from 'elysia'
import { requireDataAccess } from '../../shared/auth/require-data-access'
import { DrizzleCategoryRepository } from '../repositories/category-repository'
import { FetchCategoriesBySquadUseCase } from '../../core/use-cases/category/fetch-categories-by-squad'
import { CreateCategoryUseCase } from '../../core/use-cases/category/create-category'
import { UpdateCategoryUseCase } from '../../core/use-cases/category/update-category'
import { DeleteCategoryUseCase } from '../../core/use-cases/category/delete-category'

const categoryRepository = new DrizzleCategoryRepository()

export const categoryRoutes = new Elysia({
  name: 'routes:categories',
  prefix: '/categories',
})
  .use(requireDataAccess())
  .get(
    '/',
    async ({ query: { squadId } }) => {
      const fetchCategoriesUseCase = new FetchCategoriesBySquadUseCase(
        categoryRepository
      )
      return await fetchCategoriesUseCase.execute({ squadId })
    },
    {
      detail: { tags: ['Categories'] },
      query: t.Object({
        squadId: t.String(),
      }),
    }
  )
  .group('', (app) =>
    app
      .use(requireDataAccess('SUPERVISOR'))
      .post(
        '/',
        async ({ body }) => {
          const createCategoryUseCase = new CreateCategoryUseCase(
            categoryRepository
          )
          return await createCategoryUseCase.execute(body)
        },
        {
          detail: { tags: ['Categories'] },
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
            squadId: t.String(),
          }),
        }
      )
      .put(
        '/:id',
        async ({ params, body }) => {
          const updateCategoryUseCase = new UpdateCategoryUseCase(
            categoryRepository
          )
          return await updateCategoryUseCase.execute({
            id: params.id,
            ...body,
          })
        },
        {
          detail: { tags: ['Categories'] },
          params: t.Object({ id: t.String() }),
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
          }),
        }
      )
      .delete(
        '/:id',
        async ({ params }) => {
          const deleteCategoryUseCase = new DeleteCategoryUseCase(
            categoryRepository
          )
          return await deleteCategoryUseCase.execute({ id: params.id })
        },
        {
          detail: { tags: ['Categories'] },
          params: t.Object({ id: t.String() }),
        }
      )
  )
