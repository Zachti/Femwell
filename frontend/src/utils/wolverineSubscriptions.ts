import { gql } from '@apollo/client';

export const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription OnNewMessage($liveChatId: Int!) {
        newMessage(liveChatId: $liveChatId) {
            id
            content
            user {
                id
                username
            }
            createdAt
        }
    }
`;

export const USER_EXIT_LIVE_CHAT_SUBSCRIPTION = gql`
    subscription OnUserExitLiveChat($liveChatId: Int!) {
        userExitLiveChat(liveChatId: $liveChatId) {
            userId
        }
    }
`;

export const USER_STARTED_TYPING_SUBSCRIPTION = gql`
    subscription OnUserStartedTyping($liveChatId: Int!, $userId: String!) {
        userStartedTyping(liveChatId: $liveChatId, userId: $userId) {
            user {
                id
                username
            }
        }
    }
`;

export const USER_STOPPED_TYPING_SUBSCRIPTION = gql`
    subscription OnUserStoppedTyping($liveChatId: Int!, $userId: String!) {
        userStoppedTyping(liveChatId: $liveChatId, userId: $userId) {
            user {
                id
                username
            }
        }
    }
`;

export const PADULLA_ENTERED_LIVE_CHAT_SUBSCRIPTION = gql`
    subscription OnPadullaEnteredLiveChat($liveChatId: Int!) {
        padullaEnteredLiveChat(liveChatId: $liveChatId) {
            liveChatId
        }
    }
`;
