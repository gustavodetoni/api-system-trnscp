import { Category } from '../../entities/category'
import { CategoryRepository } from '../../repositories/category-repository'
import { Conflict } from '../../../shared/errors/conflict'

type CreateCategoryRequest = {
  name: string
  squadId: string
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ name, squadId }: CreateCategoryRequest): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByNameAndSquadId(
      name,
      squadId
    )

    if (existingCategory) {
      throw new Conflict('Category with this name already exists in the squad')
    }

    const category = await this.categoryRepository.create({
      name,
      squadId,
    })

    return category
  }
}
