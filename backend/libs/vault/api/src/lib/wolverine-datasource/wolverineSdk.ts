import { gql, GraphQLClient, Variables } from 'graphql-request';
import { GraphQLError } from 'graphql/index';
import { LoggerService } from '@backend/logger';

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
  const getWolverineMutation = (mutation: string, logger: LoggerService) => {
    switch (mutation) {
      case 'create':
        return createUserMutation;
      case 'delete':
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
    mutation: string,
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
