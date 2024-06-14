import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessage($liveChatId: PositiveInt!) {
    newMessage(liveChatId: $liveChatId) {
      id
      content
      user {
        id
        username
      }
      createdAt
      seen
    }
  }
`;

export const USER_EXIT_LIVE_CHAT_SUBSCRIPTION = gql`
  subscription OnUserExitLiveChat($liveChatId: PositiveInt!) {
    userExitLiveChat(liveChatId: $liveChatId) {
      userId
    }
  }
`;

export const USER_STARTED_TYPING_SUBSCRIPTION = gql`
  subscription OnUserStartedTyping(
    $liveChatId: PositiveInt!
    $userId: String!
  ) {
    userStartedTyping(liveChatId: $liveChatId, userId: $userId) {
      user {
        id
        username
      }
    }
  }
`;

export const USER_STOPPED_TYPING_SUBSCRIPTION = gql`
  subscription OnUserStoppedTyping(
    $liveChatId: PositiveInt!
    $userId: String!
  ) {
    userStoppedTyping(liveChatId: $liveChatId, userId: $userId) {
      user {
        id
        username
      }
    }
  }
`;

export const PADULLA_ENTERED_LIVE_CHAT_SUBSCRIPTION = gql`
  subscription OnPadullaEnteredLiveChat($liveChatId: PositiveInt!) {
    padullaEnteredLiveChat(liveChatId: $liveChatId) {
      liveChatId
    }
  }
`;
