const REGISTER_REQUEST_MUTATION = gql`
    mutation Register($registerRequest: RegisterRequest!) {
        register(registerRequest: $registerRequest) {
            id
        }
    }
`;

const CONFIRM_USER_MUTATION = gql`
    mutation Confirm($confirmUserRequest: ConfirmUserRequest!) {
        confirm(confirmUserRequest: $confirmUserRequest) {
            id
            jwt
            refreshToken
            username
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation Login($authenticateRequest: AuthenticateRequest!) {
        login(authenticateRequest: $authenticateRequest) {
            id
            email
            jwt
            refreshToken
            isValid
        }
    }
`;

const SEND_CONFIRMATION_CODE_MUTATION = gql`
    mutation SendConfirmationCode($email: String!) {
        sendConfirmationCode(email: $email)
    }
`;

const DELETE_USER_MUTATION = gql`
    mutation DeleteUser($deleteUserRequest: DeleteUserRequest!) {
        delete(deleteUserRequest: $deleteUserRequest)
    }
`;
