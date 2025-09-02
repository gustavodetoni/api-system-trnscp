import { Squad } from '../../entities/squad'
import { SquadRepository } from '../../repositories/squad-repository'
import { NotFound } from '../../../shared/errors/not-found'

type UpdateSquadRequest = {
  id: string
  name?: string
  description?: string
  language?: string
}

export class UpdateSquadUseCase {
  constructor(private squadRepository: SquadRepository) {}

  async execute({
    id,
    name,
    description,
    language,
  }: UpdateSquadRequest): Promise<Squad> {
    const updateData: Partial<Squad> = {}
    
    if (name !== undefined) {
      updateData.name = name
    }
    if (description !== undefined) {
      updateData.description = description
    }
    if (language !== undefined) {
      updateData.language = language
    }

    const updatedSquad = await this.squadRepository.update(id, updateData)

    if (!updatedSquad) {
      throw new NotFound('Squad not found')
    }

    return updatedSquad
  }
}
