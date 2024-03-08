## MelodyVerse Full-Stack Assignment

This project implements a web application, featuring user registration, post listings, and secure API endpoints.

**Technology Stack**

* **Backend:**
    * Node.js 
    * Express.js 
    * Database (MongoDB)
    * jsonwebtoken (JWT) 
* **Frontend:**
    * React.js
    * Tailwind CSS

**Features**

* **Signup Screen**
    * Fields for username/email, password, optional name and profile picture.
    * Input validation and clear error messages.
    * Terms and conditions.
    * Simulated welcome email.
    * Redirect to post list screen (React Router).

* **Post List Screen**
    * Infinite scrolling, posts fetched via GET API.
    * Responsive design (Tailwind CSS). 

* **JWT Authentication**
    * JWT tokens for user authentication.
    * Secured API endpoints.

**API Endpoints**

* **POST /signup**
    * Registers new users.
    * Input validation, unique usernames/emails, secure password hashing.

* **GET /posts**
    * Fetches posts in a paginated manner.
    * Requires authentication.

**Best Practices**
*  Robust input validation and sanitization.
*  Secure password storage (bcrypt, Argon2).
*  Informative error handling.
*  Well-structured and documented code.
*  Environment variables for sensitive data.

**Installation and Setup**

1. **Clone repository:**
    ```bash
    git clone [invalid URL removed]
    ```
2. **Install dependencies (Backend):** 
    ```bash
    cd melodyverse/backend
    npm install 
    ```
3. **Install dependencies (Frontend):** 
    ```bash
    cd melodyverse/frontend
    npm install 
    ```
4. **Database configuration:**
   * Set up database and adjust configuration in backend.

5. **Environment variables:**
   * Create a `.env` file in the backend directory for sensitive information.
