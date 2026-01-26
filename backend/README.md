# Project Endpoints

## Authentication Endpoints

### POST /api/auth/signup

- Description: Register a new user.
- Request Body: `{ "fullName": "string", "email": "string", "password": "string" }`
- Responses:
  - 201: User created successfully.
    ```json
    {
      "message": "User created successfully",
      "user": {
        "id": "string",
        "fullName": "string",
        "email": "string",
        "isVerified": false
      }
    }
    ```
  - 400: Invalid input data.
    ```json
    {
      "error": "Invalid full name format"
    }
    ```
  - 409: User already exists.
    ```json
    {
      "error": "User already exists"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/login

- Description: Log in an existing user.
- Request Body: `{ "email": "string", "password": "string" }`
- Responses:
  - 200: User logged in successfully.
    ```json
    {
      "message": "User logged in successfully",
      "user": {
        "id": "string",
        "fullName": "string",
        "email": "string"
      }
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 401: Invalid credentials.
    ```json
    {
      "error": "Invalid credentials"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/verify-email

- Description: Verify user email with OTP.
- Request Body: `{ "email": "string", "otp": "string" }`
- Responses:
  - 200: Email verified successfully.
    ```json
    {
      "message": "Email verified successfully"
    }
    ```
  - 400: Invalid OTP or email format.
    ```json
    {
      "error": "Invalid OTP"
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/resend-otp

- Description: Resend OTP for email verification.
- Request Body: `{ "email": "string" }`
- Responses:
  - 200: OTP resent successfully.
    ```json
    {
      "message": "OTP resent successfully"
    }
    ```
  - 400: Invalid email format.
    ```json
    {
      "error": "Invalid email format"
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/forget-password

- Description: Request OTP for password reset.
- Request Body: `{ "email": "string" }`
- Responses:
  - 200: OTP sent successfully.
    ```json
    {
      "message": "OTP sent successfully"
    }
    ```
  - 400: Invalid email format.
    ```json
    {
      "error": "Invalid email format"
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/verify-otp-forget-password

- Description: Verify OTP for password reset.
- Request Body: `{ "email": "string", "otp": "string" }`
- Responses:
  - 200: OTP verified successfully.
    ```json
    {
      "message": "You can now reset your password"
    }
    ```
  - 400: Invalid OTP or email format.
    ```json
    {
      "error": "Invalid OTP"
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### POST /api/auth/reset-password

- Description: Reset user password.
- Request Body: `{ "email": "string", "password": "string" }`
- Responses:
  - 200: Password reset successfully.
    ```json
    {
      "message": "Password reset successfully"
    }
    ```
  - 400: Invalid input data.
    ```json
    {
      "error": "Invalid password format"
    }
    ```
  - 404: User not found.
    ```json
    {
      "error": "User not found"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### GET /api/auth/me

- Description: Get current logged-in user details.
- Responses:
  - 200: User details retrieved successfully.
    ```json
    {
      "id": "string",
      "fullName": "string",
      "email": "string"
    }
    ```
  - 401: Access denied.
    ```json
    {
      "error": "Access denied"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### GET /api/auth/google

- Description: Authenticate user with Google.
- Responses:
  - 302: Redirects to Google authentication.

### GET /api/auth/google/callback

- Description: Callback for Google authentication.
- Responses:
  - 302: Redirects to frontend dashboard or login.
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### GET /api/auth/logout

- Description: Log out the user.
- Responses:
  - 200: User logged out successfully.
    ```json
    {
      "message": "User logged out successfully"
    }
    ```
  - 500: Internal server error.
    ```json
    {
      "error": "Internal server error"
    }
    ```
