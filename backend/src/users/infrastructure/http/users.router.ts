import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase, CreateUserInput, CreateUserOutput } from '@users/application/create-user.usecase';
import { registerOpenApiRoute } from '@shared/http/openapi-registry';

export const usersRouter = Router();

registerOpenApiRoute('POST', '/users/', {
  tags: ['users'],
  description: 'Create a new user',
  requestBodySchema: CreateUserInput,
  responseSchema: CreateUserOutput,
  responseStatus: 201,
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const usecase = container.resolve(CreateUserUseCase);
    const result = await usecase.execute(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});


