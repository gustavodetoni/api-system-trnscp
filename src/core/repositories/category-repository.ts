import { Category } from '../entities/category'

export interface CategoryRepository {
  findBySquadId(squadId: string): Promise<Category[]>
}
