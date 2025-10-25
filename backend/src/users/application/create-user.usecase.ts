import { injectable, inject } from 'tsyringe';
import { randomUUID } from 'crypto';
import { z } from 'zod/v4';
import { UserRepository } from '@users/domain/user.repository';

export const CreateUserInput = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const CreateUserOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
});

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository') private readonly repository: UserRepository
  ) {}

  async execute(input: unknown) {
    const dto = CreateUserInput.parse(input);
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) {
      throw new Error('EMAIL_TAKEN');
    }
    const user = { ...dto, id: randomUUID() };
    await this.repository.save(user);
    return CreateUserOutput.parse(user);
  }
}


