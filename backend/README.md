# Comprehensive API Documentation
---

## 1. Authentication Module (`auth.router.js`)

### 1.1 Signup
* **Method:** `POST`
* **Route:** `/auth/signup`
* **Description:** Registers a new user. Validates credentials format and ensures the user doesn't already exist before creating the record.
* **Authentication:** Not Required
* **Validation / Middleware (`validateCredentialsSignup`):**
  * `fullName`: 3-50 characters, letters and spaces only.
  * `email`: Standard email format.
  * `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`@$!%*?&`).
* **Request Body:**
    ```json
    {
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "password": "Password123!"
    }
    ```
* **Success Response (201 Created/200 OK):** *(Handled by `handleNewUser` service)*
* **Error Responses:**
    * `400 Bad Request`: Invalid full name, email, or password format.
    * `409 Conflict`: User already exists.
    * `500 Internal Server Error`

### 1.2 Login
* **Method:** `POST`
* **Route:** `/auth/login`
* **Description:** Authenticates an existing user and delegates session/cookie creation to the `handleExistingUser` service.
* **Authentication:** Not Required
* **Validation / Middleware (`validateCredentialsLogin`):** Checks for valid email format and presence of a password.
* **Request Body:**
    ```json
    {
      "email": "johndoe@example.com",
      "password": "Password123!"
    }
    ```
* **Success Response (200 OK):** *(Handled by `handleExistingUser` service)*
* **Error Responses:**
    * `400 Bad Request`: Invalid email format or password missing.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.3 Verify Email
* **Method:** `POST`
* **Route:** `/auth/verify-email`
* **Description:** Verifies a user's email using a 6-digit OTP. Updates the user's `isVerified` status and clears the OTP from the database.
* **Authentication:** Not Required
* **Validation / Middleware (`validateOTPAndEmail`):** Validates email format and ensures OTP is exactly 6 digits.
* **Request Body:**
    ```json
    {
      "email": "johndoe@example.com",
      "otp": "123456"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "Email verified successfully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Invalid OTP format, invalid OTP, OTP expired, or email already verified.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.4 Resend OTP
* **Method:** `POST`
* **Route:** `/auth/resend-otp`
* **Description:** Generates a new OTP, hashes it, saves it to the user record (valid for 10 minutes), and sends it via email.
* **Authentication:** Not Required
* **Validation / Middleware (`validateEmail`):** Valid email format required.
* **Request Body:**
    ```json
    { "email": "johndoe@example.com" }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "OTP resent successfully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Invalid email format or email already verified.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.5 Forget Password OTP
* **Method:** `POST`
* **Route:** `/auth/forget-password`
* **Description:** Generates and emails an OTP for password recovery purposes. (Similar internal logic to `resend-otp` but does not check if the email is already verified).
* **Authentication:** Not Required
* **Validation / Middleware (`validateEmail`):** Valid email format required.
* **Request Body:**
    ```json
    { "email": "johndoe@example.com" }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "OTP resent successfully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Invalid email format.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.6 Verify Forget Password OTP
* **Method:** `POST`
* **Route:** `/auth/verify-otp-forget-password`
* **Description:** Validates the OTP provided by the user to authorize a password reset. Does NOT reset the password itself.
* **Authentication:** Not Required
* **Validation / Middleware (`validateOTPAndEmail`):** Valid email format and 6-digit OTP required.
* **Request Body:**
    ```json
    {
      "email": "johndoe@example.com",
      "otp": "123456"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "You can now reset your password" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Invalid OTP, OTP format invalid, or OTP expired.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.7 Reset Password
* **Method:** `POST`
* **Route:** `/auth/reset-password`
* **Description:** Updates the user's password after hashing it, and clears any active OTPs.
* **Authentication:** Not Required
* **Validation / Middleware (`validateEmail`, `validateResetPassword`):** Ensures valid email and strict password format.
* **Request Body:**
    ```json
    {
      "email": "johndoe@example.com",
      "password": "NewPassword123!"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "Password reset successfully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Invalid email or password format.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.8 Get Current User
* **Method:** `GET`
* **Route:** `/auth/me`
* **Description:** Retrieves the database record of the currently authenticated user based on their access token.
* **Authentication:** Required (`accessToken` HTTP-only cookie).
* **Success Response (200 OK):** Returns the full user object (from DB).
* **Error Responses:**
    * `401 Unauthorized`: Token missing, invalid, or expired (includes `shouldLogout: true` flag).
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`

### 1.9 Refresh Token
* **Method:** `POST`
* **Route:** `/auth/refresh-token`
* **Description:** Validates the existing refresh token and generates a new `accessToken` (15m expiry) and `refreshToken` (7d expiry) as HTTP-only cookies.
* **Authentication:** Required (`refreshToken` HTTP-only cookie).
* **Success Response (201 Created):**
    ```json
    { "message": "Access token refreshed" }
    ```
* **Error Responses:**
    * `401 Unauthorized`: `REFRESH_TOKEN_INVALID` or `REFRESH_TOKEN_EXPIRED`.
    * `404 Not Found`: User not found.

### 1.10 Google OAuth Initiation
* **Method:** `GET`
* **Route:** `/auth/google`
* **Description:** Redirects the user to the Google OAuth consent screen. Requests `profile` and `email` scopes.
* **Authentication:** Not Required

### 1.11 Google OAuth Callback
* **Method:** `GET`
* **Route:** `/auth/google/callback`
* **Description:** The callback URL for Google OAuth. Generates JWT cookies and redirects the user to the frontend.
* **Authentication:** Not Required (Handled via Passport Google Strategy)
* **Success Response:** `302 Redirect` to frontend (to `/login` if newly registered, or `/auth/callback` if logging in).

### 1.12 Logout
* **Method:** `GET`
* **Route:** `/auth/logout`
* **Description:** Clears session cookies (`accessToken`, `refreshToken`) and redirects to the frontend root.
* **Authentication:** Not Required
* **Success Response:** `302 Redirect` to `FRONTEND_PORT/`.

---

## 2. User Management Module (`user.router.js`)

### 2.1 Update User Details
* **Method:** `PATCH`
* **Route:** `/user/:id`
* **Description:** Updates a user's basic profile details (Full name or Email).
* **Authentication:** Required (`accessToken` HTTP-only cookie).
* **Validation / Middleware (`validateUpdateData`):** Rejects request if both `fullName` and `email` are missing, or if formats are invalid.
* **Path Parameters:**
    * `id`: User ID string/UUID.
* **Request Body:**
    ```json
    {
      "fullName": "Jane Doe",
      "email": "janedoe@example.com"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "User updated successdully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: `INVALID_REQUEST` (both empty), or invalid format.
    * `401 Unauthorized`: Invalid/missing access token.
    * `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`

### 2.2 Update User Password
* **Method:** `PATCH`
* **Route:** `/user/password/:id`
* **Description:** Updates a user's password. Bypasses current password validation if the user registered via Google.
* **Authentication:** Required (`accessToken` HTTP-only cookie).
* **Validation / Middleware (`validateCurrentPassword`, `validateNewPassword`):** Verifies the current password matches the DB, and validates the new password format.
* **Path Parameters:**
    * `id`: User ID string/UUID.
* **Request Body:**
    ```json
    {
      "currentPassword": "OldPassword123!",
      "newPassword": "NewPassword123!"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "User updated successdully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Password not correct or invalid new password format.
    * `401 Unauthorized`: Invalid/missing access token.
    * `404 Not Found`: User not found.
    * `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`

---

## 3. Chat Module (`chat.router.js`)

### 3.1 Handle AI Chat (Authenticated)
* **Method:** `POST`
* **Route:** `/chat/`
* **Description:** Processes a chat prompt for an authenticated user. Includes complex validations to prevent duplicate processing (idempotency via `clientMessageId`) and enforces conversation ownership.
* **Authentication:** Required (`accessToken` HTTP-only cookie).
* **Validation / Middleware:** * `chatRateLimit`: Enforces rate limiting.
  * `validateMessageLength`: Ensures content <= 1000 characters.
  * `validatePrompt`: Verifies `clientMessageId`, checks conversation ownership, and checks if the message is already processing (`IN_PROGRESS`).
* **Request Body:**
    ```json
    {
      "content": "What is the capital of France?",
      "clientMessageId": "123e4567-e89b-12d3-a456-426614174000",
      "conversationId": "optional-convo-id" 
    }
    ```
* **Success Response (201 Created or 200 OK):**
    * `201 Created`: Returns the newly generated AI response object from `handleChat`.
    * `200 OK`: Returns the existing AI response if the `clientMessageId` was already resolved previously.
* **Error Responses:**
    * `400 Bad Request`: Missing `clientMessageId`, missing `content`, or length > 1000.
    * `401 Unauthorized`: Missing token or missing User ID in request.
    * `403 Forbidden`: User does not own the conversation.
    * `404 Not Found`: Conversation does not exist.
    * `409 Conflict`: `IN_PROGRESS` (Message is currently being handled).
    * `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`

### 3.2 Handle AI Chat (Without Auth)
* **Method:** `POST`
* **Route:** `/chat/without-auth`
* **Description:** Processes a chat prompt without requiring user authentication. Useful for public/trial interactions. Does not validate conversation state or idempotency.
* **Authentication:** Not Required
* **Validation / Middleware:** * `chatRateLimit`: Enforces rate limiting.
  * `validateMessageLength`: Ensures content <= 1000 characters.
* **Request Body:**
    ```json
    {
      "content": "Explain quantum computing briefly."
    }
    ```
* **Success Response (201 Created):** Returns the generated AI response object from `handleChatWithoutAuth`.
* **Error Responses:**
    * `400 Bad Request`: Missing `content` or length > 1000.
    * `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`
---

## 4. Conversations Module (`conversation.router.js`)

Endpoints for managing user chat conversations.

### 4.1 Get All Conversations
* **Method:** `GET`
* **Route:** `/conversation/`
* **Description:** Retrieves all conversations belonging to the authenticated user.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Success Response (200 OK):** *(Inferred from `fetchConversations` service)* Returns an array of conversation objects.
    ```json
    [
      {
        "id": "conv-123",
        "userId": "uuid-123",
        "title": "Discussion about Express",
        "createdAt": "2023-10-01T12:00:00Z"
      }
    ]
    ```
* **Error Responses:**
    * `400 Bad Request`: User ID is missing (e.g., token issue).
    * `401 Unauthorized`: Token missing or invalid.
    * `500 Internal Server Error`: Error fetching conversations.

### 4.2 Get Single Conversation
* **Method:** `GET`
* **Route:** `/conversation/:id`
* **Description:** Retrieves a specific conversation by its ID for the authenticated user.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Path Parameters:**
    * `id`: ID of the conversation.
* **Success Response (200 OK):** *(Inferred from `fetchConversation` service)*
    ```json
    {
      "id": "conv-123",
      "userId": "uuid-123",
      "messages": [...]
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: Conversation ID is required.
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: Conversation not found.
    * `500 Internal Server Error`: Error fetching conversation.

### 4.3 Create Conversation
* **Method:** `POST`
* **Route:** `/conversation/`
* **Description:** Creates a new conversation. *(Note: Input validation is currently missing in the router as per code comments).*
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Request Body:**
    ```json
    {
      "title": "New Conversation",
      "initialMessage": "Hello"
    }
    ```
    *(Note: Body fields are passed directly to `createConversation` service).*
* **Success Response (201 Created):** Returns the newly created conversation object.
* **Error Responses:**
    * `400 Bad Request`: User ID is missing.
    * `401 Unauthorized`: Token missing or invalid.
    * `500 Internal Server Error`: Error creating conversation.

### 4.4 Delete Conversation
* **Method:** `DELETE`
* **Route:** `/conversation/:id`
* **Description:** Deletes a specific conversation by its ID.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Path Parameters:**
    * `id`: ID of the conversation to delete.
* **Success Response (204 No Content):** Empty body returned upon successful deletion.
* **Error Responses:**
    * `400 Bad Request`: Conversation ID is required.
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: Conversation not found or could not be deleted.
    * `500 Internal Server Error`: Error deleting conversation.

---

## 5. Feedback Module (`feedback.router.js`)

Endpoints for submitting user feedback on generated ideas.

### 5.1 Send Feedback
* **Method:** `POST`
* **Route:** `/feedback/`
* **Description:** Submits user feedback (rating and text) for a specific idea.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Validation:** Custom logic inside the controller ensures all fields are present and of the correct data type.
* **Request Body:**
    ```json
    {
      "ideaId": 123, 
      "rating": 5, 
      "text": "Great idea, very helpful!" 
    }
    ```
    *(Note on Validation Quirks: `ideaId` must explicitly be a `number`, but if it fails, the API responds with `"ideaId must be a valid string"`. `rating` must be a number between 1 and 5. `text` must be a non-empty string).*
* **Success Response (201 Created):**
    ```json
    {
      "message": "Feedback submitted successfully",
      "feedback": { ... } 
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: 
        * `"ideaId is required"` or `"ideaId must be a valid string"`
        * `"rating is required"` or `"rating must be a number between 1 and 5"`
        * `"comment is required"` (Triggered if `text` is missing, invalid, or empty)
    * `401 Unauthorized`: Token missing or invalid.
    * `500 Internal Server Error`: Internal server error.

---

## 6. Ideas Module (`idea.controllers.js`)

Endpoints for saving, unsaving, and retrieving ideas. 
*(Note: Route paths below are logical inferences based on controller parameter requirements, as the router file was not provided).*

### 6.1 Save User Idea
* **Method:** `POST`
* **Route:** `/idea/saved-ideas` *(Inferred Route)*
* **Description:** Saves a specific idea referencing a specific message for the authenticated user.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Validation / Middleware (`validateIdeaFields`):** Requires both `ideaId` and `messageId` in the request body.
* **Request Body:**
    ```json
    {
      "ideaId": "idea-123",
      "messageId": "msg-456"
    }
    ```
* **Success Response (200 OK):**
    ```json
    { "message": "Idea saved successflly" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Missing fields, or failed to save idea in DB.
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: Idea not found in DB prior to saving.
    * `500 Internal Server Error`: Internal server error.

### 6.2 Unsave User Idea
* **Method:** `DELETE`
* **Route:** `/idea/saved-ideas/:id/:messageid` *(Inferred Route based on `req.params`)*
* **Description:** Removes a saved idea from the authenticated user's profile.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Path Parameters:**
    * `id`: The ID of the Idea (`ideaId`).
    * `messageid`: The ID of the Message (`messageId`).
* **Success Response (200 OK):**
    ```json
    { "message": "Idea unsaved successfully" }
    ```
* **Error Responses:**
    * `400 Bad Request`: Failed to unsave idea.
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: Idea not found.
    * `500 Internal Server Error`: Internal server error.

### 6.3 Get Saved Ideas
* **Method:** `GET`
* **Route:** `/idea/saved-ideas` *(Inferred Route)*
* **Description:** Retrieves all ideas saved by the authenticated user.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Success Response (200 OK):**
    ```json
    {
      "ideas": [
        {
          "id": "idea-123",
          "title": "Content Idea",
          "messageId": "msg-456"
        }
      ]
    }
    ```
* **Error Responses:**
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: No saved ideas found.
    * `500 Internal Server Error`: `INTERNAL_SERVER_ERROR`

### 6.4 Get Single Saved Idea
* **Method:** `GET`
* **Route:** `/idea/saved-ideas/:id` *(Inferred Route)*
* **Description:** Retrieves a specific saved idea for the authenticated user based on the idea's ID.
* **Authentication:** Required (`accessToken` HTTP-only cookie)
* **Path Parameters:**
    * `id`: The ID of the saved idea.
* **Success Response (200 OK):**
    ```json
    {
      "idea": {
        "id": "idea-123",
        "title": "Content Idea",
        "details": "..."
      }
    }
    ```
* **Error Responses:**
    * `401 Unauthorized`: Token missing or invalid.
    * `404 Not Found`: Saved idea not found.
    * `500 Internal Server Error`: Internal server error.