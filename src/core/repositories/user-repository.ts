import { User } from '../entities/user'

export interface UserRepository {
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, data: Partial<User>): Promise<User | null>
  delete(id: string): Promise<User | null>
}