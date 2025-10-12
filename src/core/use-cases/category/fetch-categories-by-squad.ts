import { Category } from '../../entities/category'
import { CategoryRepository } from '../../repositories/category-repository'

type FetchCategoriesBySquadRequest = {
  squadId: string
}

export class FetchCategoriesBySquadUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ squadId }: FetchCategoriesBySquadRequest): Promise<Category[]> {
    const categories = await this.categoryRepository.findBySquadId(squadId)
    return categories
  }
}
