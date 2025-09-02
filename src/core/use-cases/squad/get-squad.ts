import { Squad } from '../../entities/squad'
import { SquadRepository } from '../../repositories/squad-repository'
import { NotFound } from '../../../shared/errors/not-found'

type GetSquadRequest = {
  id: string
  userId?: string
  isAdmin?: boolean
}

export class GetSquadUseCase {
  constructor(private squadRepository: SquadRepository) {}

  async execute({ id, userId, isAdmin = false }: GetSquadRequest): Promise<Squad> {
    const squad = await this.squadRepository.findById(id, userId, isAdmin)

    if (!squad) {
      throw new NotFound('Squad not found')
    }

    return squad
  }
}
