import { NotFound } from '../../../shared/errors/not-found'
import { SquadRepository } from '../../repositories/squad-repository'

type DeleteSquadRequest = {
  id: string
}

export class DeleteSquadUseCase {
  constructor(private squadRepository: SquadRepository) {}

  async execute({ id }: DeleteSquadRequest) {
    const response = await this.squadRepository.delete(id)

    if (!response) {
      throw new NotFound('Squad not found')
    }

    return { id }
  }
}
