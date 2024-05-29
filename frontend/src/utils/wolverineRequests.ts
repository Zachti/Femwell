// USERS RESOLVER REQUESTS -
import { gql } from "@apollo/client";
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      username
      phoneNumber
    }
  }
`;

//this needs to have profilePic and comments to have their usernames
export const GET_USER_PROFILE_QUERY = gql`
  query GetUserProfile($id: UUID!) {
    oneUser(id: $id) {
      id
      email
      username
      likes {
        postId
      }
      posts {
        id
        username
        content
        comments {
          username
          content
          postId
        }
      }
      phoneNumber
      readLater
      profilePic
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      username
      phoneNumber
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: UUID!) {
    deleteUser(id: $id) {
      id
      email
      username
      phoneNumber
    }
  }
`;

export const FIND_ALL_USERS_QUERY = gql`
  query FindAllUsers {
    allUsers {
      id
      email
      username
      phoneNumber
    }
  }
`;

export const FIND_ONE_USER_QUERY = gql`
  query FindOneUser($id: UUID!) {
    oneUser(id: $id) {
      id
      email
      username
      phoneNumber
    }
  }
`;

// user dtos -

export interface CreateUserInput {
  cognitoUserId: string;

  email: string;

  profileUsername: string;

  phoneNumber?: string;
}

export interface UpdateUserInput {
  id: string;

  username: string;

  phoneNumber?: string;

  newUsername?: string;

  readLater?: string[];

  profilePic?: string;
}

// QUESTIONNAIRE RESOLVER REQUESTS -

export const CREATE_QUESTIONNAIRE_MUTATION = gql`
  mutation CreateQuestionnaire(
    $createQuestionnaireInput: CreateQuestionnaireInput!
  ) {
    createQuestionnaire(createQuestionnaireInput: $createQuestionnaireInput) {
      id
      userId
      responses {
        question
        answer
      }
    }
  }
`;

export const FIND_ALL_QUESTIONNAIRES_QUERY = gql`
  query FindAllQuestionnaires {
    questionnaire {
      id
      userId
      responses {
        id
        question
        answer
      }
    }
  }
`;

export const FIND_ONE_QUESTIONNAIRE_QUERY = gql`
  query FindOneQuestionnaire($id: UUID!) {
    oneQuestionnaire(id: $id) {
      id
      userId
      responses {
        id
        question
        answer
      }
    }
  }
`;

export const FIND_QUESTIONNAIRE_BY_USER_QUERY = gql`
  query FindQuestionnaireByUser($userId: UUID!) {
    questionnaireByUserId(userId: $userId) {
      id
      userId
      responses {
        id
        question
        answer
        questionnaireId
      }
    }
  }
`;

// questionnaire dtos -

interface Response {
  id: string;

  question: string;

  answer?: string;

  questionnaireId: string;
}

interface CreateQuestionnaireInput {
  userId: string;

  responses: Response[];

  username: string;
}

interface createResponseInput {
  question: string;

  answer?: string;
}

// COMMENT RESOLVER REQUESTS -

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      content
      userId
      postId
      username
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($updateCommentInput: UpdateCommentInput!) {
    updateComment(updateCommentInput: $updateCommentInput) {
      id
      content
      userId
      postId
      username
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: PositiveInt!, $userId: UUID!) {
    deleteComment(id: $id, userId: $userId) {
      id
      content
      userId
      postId
      username
    }
  }
`;

export const GET_COMMENTS_QUERY = gql`
  query GetComments($postId: UUID!) {
    getComments(postId: $postId) {
      id
      content
      userId
      postId
      username
      createdAt
      userProfilePic
    }
  }
`;

// comment dtos -

interface CreateCommentInput {
  username: string;
  content: string;
  userId: string;
  postId: string;
}

interface UpdateCommentInput {
  id: number;
  content: string;
  postId: string;
}

// POST RESOLVER REQUESTS -

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      content
      userId
      username
      createdAt
      isAnonymous
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($updatePostInput: UpdatePostInput!) {
    updatePost(updatePostInput: $updatePostInput) {
      id
      content
      userId
      username
      imageUrl
      isAnonymous
      createdAt
      comments {
        id
        content
        username
      }
      likes {
        id
        username
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: UUID!) {
    deletePost(id: $id) {
      id
      content
      userId
      username
      imageUrl
      isAnonymous
      createdAt
      comments {
        id
        content
        username
      }
      likes {
        id
        username
      }
    }
  }
`;

export const GET_POSTS_QUERY = gql`
  mutation GetPosts($filter: PostsFilter) {
    getPosts(filter: $filter) {
      id
      content
      userId
      username
      imageUrl
      isAnonymous
      createdAt
      comments {
        id
        content
        username
      }
      likes {
        id
        username
      }
    }
  }
`;

// post dtos -

interface CreatePostInput {
  username: string;
  content: string;
  userId: string;
  imageUrl?: string;
  isAnonymous?: boolean;
}

interface UpdatePostInput {
  id: string;
  content: string;
  userId: string;
  imageUrl?: string;
}

interface PostsFilter {
  ids: string[];
  usernames: string[];
}

// LIKES RESOLVER REQUESTS -

export const CREATE_LIKE_MUTATION = gql`
  mutation CreateLike($createLikeInput: CreateOrDeleteLikeInput!) {
    createLike(createLikeInput: $createLikeInput) {
      id
      postId
      userId
      username
    }
  }
`;

export const DELETE_LIKE_MUTATION = gql`
  mutation DeleteLike($deleteLikeInput: CreateOrDeleteLikeInput!) {
    deleteLike(deleteLikeInput: $deleteLikeInput)
  }
`;

export const GET_LIKES_QUERY = gql`
  query GetLikes($postId: UUID!) {
    getLikes(postId: $postId) {
      id
      postId
      userId
      username
    }
  }
`;

// like dtos -

interface CreateOrDeleteLikeInput {
  postId: string;
  userId: string;
  username: string;
}

// LIVE CHAT RESOLVER REQUESTS -

export const CREATE_LIVE_CHAT_MUTATION = gql`
  mutation CreateLiveChat($name: String!, $userId: UUID!) {
    createLiveChat(name: $name, userId: $userId) {
      id
      name
      createdAt
      updatedAt
      users {
        id
        email
        username
        phoneNumber
      }
      messages {
        id
        content
        userId
        user {
          email
          username
          phoneNumber
        }
        seen
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_LIVE_CHAT_MUTATION = gql`
  mutation DeleteLiveChat($id: UUID!) {
    deleteLiveChat(id: $id) {
      id
      name
      createdAt
      updatedAt
      users {
        id
        email
        username
        phoneNumber
      }
      messages {
        id
        content
        userId
        user {
          email
          username
          phoneNumber
        }
        seen
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_LIVE_CHAT_QUERY = gql`
  query GetLiveChat($liveChatId: PositiveInt!) {
    getLiveChat(liveChatId: $liveChatId) {
      id
      name
      createdAt
      updatedAt
      users {
        id
        email
        username
        phoneNumber
      }
      messages {
        id
        content
        userId
        user {
          email
          username
          phoneNumber
        }
        seen
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PREVIOUS_CHATS_FOR_USER_QUERY = gql`
  query GetPreviousChatsForUser($userId: UUID!) {
    getPreviousChatsForUser(userId: $userId) {
      id
      name
      createdAt
      updatedAt
      users {
        id
        email
        username
        phoneNumber
      }
      messages {
        id
        content
        userId
        user {
          email
          username
          phoneNumber
        }
        seen
        createdAt
        updatedAt
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage(
    $liveChatId: PositiveInt!
    $content: String!
    $userId: UUID!
  ) {
    sendMessage(liveChatId: $liveChatId, content: $content, userId: $userId) {
      id
      content
      userId
      user {
        email
        username
        phoneNumber
      }
      seen
      createdAt
      updatedAt
    }
  }
`;

export const ADD_PADULLA_TO_LIVE_CHAT_MUTATION = gql`
  mutation AddPadullaToLiveChat($liveChatId: PositiveInt!, $userId: UUID!) {
    addPadullaToLiveChat(liveChatId: $liveChatId, userId: $userId) {
      id
      name
      createdAt
      updatedAt
      users {
        id
        email
        username
        phoneNumber
      }
      messages {
        id
        content
        userId
        user {
          email
          username
          phoneNumber
        }
        seen
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_MESSAGES_FOR_LIVE_CHAT_QUERY = gql`
  query GetMessagesForLiveChat($liveChatId: PositiveInt!) {
    getMessagesForLiveChat(liveChatId: $liveChatId) {
      id
      content
      userId
      user {
        email
        username
        phoneNumber
      }
      seen
      createdAt
      updatedAt
    }
  }
`;

export const SET_MESSAGE_SEEN_MUTATION = gql`
  mutation setMessagesAsRead($messageId: PositiveInt!) {
    setMessageSeen(messageId: $messageId)
  }
`;

export const SET_MESSAGES_UNSEEN_MUTATION = gql`
  mutation setMessageAsUnread($liveChatId: PositiveInt!) {
    setMessagesUnseen(liveChatId: $liveChatId)
  }
`;
