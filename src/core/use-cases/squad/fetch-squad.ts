import { SquadRepository } from '../../repositories/squad-repository'

type FetchSquadsRequest = {
  search?: string
  page?: number
  pageSize?: number
  userId?: string
  isAdmin?: boolean
}

type FetchSquadsResponse = {
  data: Array<{
    id: string
    name: string
    description: string
    language: string
    createdAt: Date
    updatedAt: Date
  }>
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export class FetchSquadsUseCase {
  constructor(private squadRepository: SquadRepository) {}

  async execute({
    search,
    page = 1,
    pageSize = 20,
    userId,
    isAdmin = false
  }: FetchSquadsRequest): Promise<FetchSquadsResponse> {
    const result = await this.squadRepository.findMany({
      search,
      page,
      pageSize,
      userId,
      isAdmin
    })

    if (!result) {
      throw new Error('Error fetching squads')
    }

    const { data: squads, total } = result
    const totalPages = Math.ceil(total / pageSize)

    return {
      data: squads.map((squad) => ({
        id: squad.id,
        name: squad.name,
        description: squad.description,
        language: squad.language,
        createdAt: squad.createdAt,
        updatedAt: squad.updatedAt
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1
      }
    }
  }
}
