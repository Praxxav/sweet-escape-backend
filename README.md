# Sweet Escape - Backend

This is the backend server for the "Sweet Escape" application. It's a robust Node.js API built with Express and TypeScript, designed to handle authentication, inventory management, and purchase logging. It uses Prisma as its ORM for seamless database interaction.

## ✨ Features

-   **Secure Authentication**:
    -   User registration and login system.
    -   JWT (JSON Web Tokens) for securing API endpoints.
    -   Role-based access control (RBAC) to differentiate between regular `USER`s and `ADMIN`s.
-   **Comprehensive Sweets API**:
    -   Full CRUD (Create, Read, Update, Delete) operations for sweets.
    -   Admin-only endpoints for adding, updating, and deleting sweets.
    -   Public endpoints for listing and searching the sweet inventory.
-   **Transactional Purchase Logic**:
    -   Handles user purchases by decrementing sweet quantity in the database.
    -   Logs every purchase with user, sweet, quantity, and price details.
-   **Purchase History**:
    -   An admin-only endpoint to retrieve a complete history of all purchases, including user and sweet details.

## 🛠️ Tech Stack

-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Runtime**: Node.js
-   **Database ORM**: Prisma
-   **Authentication**: JWT (jsonwebtoken)
-   **Password Hashing**: bcrypt

## 🗄️ Database Schema

The Prisma schema defines three core models:

1.  **`User`**: Stores user information, including `id`, `name`, `email`, `password` (hashed), and `role` (`USER` or `ADMIN`).
2.  **`Sweet`**: Represents the inventory, with fields like `id`, `name`, `description`, `price`, `quantity`, `category`, and `image`.
3.  **`Purchase`**: A log of all transactions, linking a `User` and a `Sweet` and recording the `quantity` and `priceAtPurchase`.

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)

-   `POST /register`: Create a new user account.
-   `POST /login`: Log in and receive a JWT.

### Sweets (`/sweets`)

-   `GET /`: List all available sweets.
-   `GET /search`: Search for sweets by a query term.
-   `POST /`: **(Admin only)** Add a new sweet.
-   `PUT /:id`: **(Admin only)** Update an existing sweet.
-   `DELETE /:id`: **(Admin only)** Delete a sweet.
-   `POST /:id/purchase`: **(User only)** Purchase a sweet.
-   `POST /:id/restock`: **(Admin only)** Restock a sweet.

### Purchases (`/purchases`)

-   `GET /`: **(Admin only)** Retrieve the complete purchase history.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A PostgreSQL, MySQL, or SQLite database.

### Installation & Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd sweet_shop/back
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your database:**
    -   Create a `.env` file in the `back` directory.
    -   Add your `DATABASE_URL` to the `.env` file. For example, for PostgreSQL:
        ```
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
        ```
    -   Add a `JWT_SECRET`:
        ```
        JWT_SECRET="your-super-secret-key"
        ```

4.  **Run database migrations:**
    This will create the necessary tables in your database based on the Prisma schema.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The API server will be available at `http://localhost:3000`.