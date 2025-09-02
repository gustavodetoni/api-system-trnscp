import { Squad } from '../entities/squad'

type FindManyFilters = {
  search?: string
  page?: number
  pageSize?: number
  userId?: string
  isAdmin?: boolean
}

type FindManyResult = {
  data: Squad[]
  total: number
}

export interface SquadRepository {
  create(
    data: Omit<Squad, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Squad>
  findById(id: string, userId?: string, isAdmin?: boolean): Promise<Squad | null>
  findMany(filters?: FindManyFilters): Promise<FindManyResult>
  update(id: string, data: Partial<Squad>): Promise<Squad | null>
  delete(id: string): Promise<Squad | null>
}
