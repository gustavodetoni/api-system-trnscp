import { CategoryRepository } from '../../repositories/category-repository'
import { NotFound } from '../../../shared/errors/not-found'

type DeleteCategoryRequest = {
  id: string
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ id }: DeleteCategoryRequest): Promise<{ id: string }> {
    const category = await this.categoryRepository.delete(id)

    if (!category) {
      throw new NotFound('Category not found')
    }

    return { id }
  }
}
