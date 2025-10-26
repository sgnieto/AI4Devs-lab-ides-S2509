import { injectable, inject } from 'tsyringe';
import { z } from 'zod';
import { UserRepository } from '@users/domain/user.repository';
import bcrypt from 'bcryptjs';

const allowedRoles = ['recruiter', 'hiring_manager', 'hr_ops'] as const
type RoleLiteral = (typeof allowedRoles)[number]
const RoleSchema = z
  .string()
  .refine((v): v is RoleLiteral => (allowedRoles as readonly string[]).includes(v), {
    message: 'INVALID_ROLE',
  })

export const CreateUserInput = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: RoleSchema.default('recruiter'),
});

export const CreateUserOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema,
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
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const toSave = { email: dto.email, name: dto.name, passwordHash, role: dto.role };
    const saved = await this.repository.save(toSave);
    return CreateUserOutput.parse({ id: saved.id, email: saved.email, name: saved.name, role: saved.role });
  }
}


