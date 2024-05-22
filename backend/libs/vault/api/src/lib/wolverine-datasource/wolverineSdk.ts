import { gql, GraphQLClient, Variables } from 'graphql-request';
import { GraphQLError } from 'graphql/index';
import { LoggerService } from '@backend/logger';
import { mutationType } from './enums';

const createUserMutation = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
    }
  }
`;
const deleteUserMutation = gql`
  mutation deleteUser($id: UUID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function getSdk(client: GraphQLClient) {
  const getWolverineMutation = (
    mutation: mutationType,
    logger: LoggerService,
  ) => {
    switch (mutation) {
      case mutationType.create:
        return createUserMutation;
      case mutationType.delete:
        return deleteUserMutation;
      default:
        logger.error(`Not Allowed mutation: ${mutation}.`);
        throw new GraphQLError(`Not Allowed mutation: ${mutation}.`, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
    }
  };

  const sendWolverineMutation = async (
    mutation: mutationType,
    args: Variables,
    logger: LoggerService,
  ) => {
    try {
      await client.request(getWolverineMutation(mutation, logger), args);
      logger.info(`user ${mutation} from Wolverine DB.`, args);
    } catch (e) {
      logger.error(
        ` Couldn't ${mutation} user at wolverine DB. user args: ${args}`,
        { e },
      );
      throw new GraphQLError(
        ` Couldn't ${mutation} user at wolverine DB. user args: ${args}`,
        {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        },
      );
    }
  };

  return {
    sendWolverineMutation,
  };
}

export type Sdk = ReturnType<typeof getSdk>;
