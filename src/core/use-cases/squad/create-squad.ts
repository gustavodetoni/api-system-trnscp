import { Squad } from '../../entities/squad'
import { SquadRepository } from '../../repositories/squad-repository'

type CreateSquadRequest = {
  name: string
  description?: string
  language: string
}

export class CreateSquadUseCase {
  constructor(private squadRepository: SquadRepository) {}

  async execute({
    name,
    description,
    language,
  }: CreateSquadRequest): Promise<Squad> {
    const response = await this.squadRepository.create({
      name,
      description: description ?? '',
      language,
    })

    if (!response) {
      throw new Error('Error creating squad')
    }

    return response
  }
}
