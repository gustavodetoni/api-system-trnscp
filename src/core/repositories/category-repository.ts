import { Category } from '../entities/category'

export interface CategoryRepository {
  create(
    data: Omit<
      Category,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    >
  ): Promise<Category>
  findById(id: string): Promise<Category | null>
  findByNameAndSquadId(name: string, squadId: string): Promise<Category | null>
  findBySquadId(squadId: string): Promise<Category[]>
  update(
    id: string,
    data: Partial<
      Omit<
        Category,
        'id' | 'squadId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
      >
    >
  ): Promise<Category | null>
  delete(id: string): Promise<Category | null>
}
