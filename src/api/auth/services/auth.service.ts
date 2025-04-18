import { StatusCodes } from 'http-status-codes';

import { AppDataSource } from '@/data-source';
import { ErrorCode, SuccessCode } from '@/domain/code-mapper.map';
import { ResponseStatus, ServiceResponse } from '@/domain/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { CreateUserResponse } from '../domain/responses/create-user.response';
import { SignInResponse } from '../domain/responses/sign-in.response';
import { AuthToken } from '../entities/auth-token.entity';

const authTokenRepository = AppDataSource.getRepository(AuthToken);

export const authService = {
  createUser: async (token: string): Promise<CreateUserResponse> => {
    try {
      const existingUser = await authTokenRepository.findOneBy({ token });

      if (existingUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User with this token already exists',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.USER_ALREADY_EXISTS_400
        );
      }

      const newUser = authTokenRepository.create({ token });
      await authTokenRepository.save(newUser);

      return new ServiceResponse(
        ResponseStatus.Success,
        'User created successfully',
        null,
        StatusCodes.CREATED,
        SuccessCode.SUCCESS_201
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error creating user', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  signIn: async (token: string): Promise<SignInResponse> => {
    try {
      const existingUser = await authTokenRepository.findOneBy({ token });

      if (!existingUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User with this token does not exist',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.USER_NOT_FOUND_404
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        'User signed in successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error signing in user', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
