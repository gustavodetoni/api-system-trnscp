import { Category } from '../../entities/category'
import { CategoryRepository } from '../../repositories/category-repository'
import { NotFound } from '../../../shared/errors/not-found'
import { Conflict } from '../../../shared/errors/conflict'

type UpdateCategoryRequest = {
  id: string
  name: string
  description?: string
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ id, name, description }: UpdateCategoryRequest): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findById(id)

    if (!categoryToUpdate) {
      throw new NotFound('Category not found')
    }

    const existingCategory = await this.categoryRepository.findByNameAndSquadId(
      name,
      categoryToUpdate.squadId
    )

    if (existingCategory && existingCategory.id !== id) {
      throw new Conflict('Category with this name already exists in the squad')
    }

    const updatedCategory = await this.categoryRepository.update(id, { name, description })

    if (!updatedCategory) {
      throw new NotFound('Category not found')
    }

    return updatedCategory
  }
}
