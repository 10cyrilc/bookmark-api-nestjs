# NestJS Bookmarks API

This project is based on the [NestJS tutorial](https://www.youtube.com/watch?v=GHTA143_b-s) by FreeCodeCamp.

## 🚀 Project Overview

This project is a **Bookmarks API**, built using **NestJS**. It includes features such as authentication, database integration, and automated testing.

## 📦 Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL (via [neon.tech](neon.tech))
- **ORM:** Prisma
- **Authentication:** Passport.js with JWT
- **Configuration Management:** dotenv
- **Testing:** PactumJS (for end-to-end testing)

## 🛠 Installation

### Prerequisites

- Node.js (v22.12+ recommended)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/10cyrilc/bookmark-api-nestjs.git
   cd bookmark-api-nestjs
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Create environment variables

4. Start the development server:

   ```bash
   yarn run start:dev
   ```

## 🚦 API Endpoints

| Method | Endpoint         | Description           | Auth Required |
|--------|-----------------|-----------------------|---------------|
| POST   | /auth/signup     | Register a new user   | ❌             |
| POST   | /auth/signin     | Login user            | ❌             |
| GET    | /users/me        | Get current user      | ✅             |
| POST   | /bookmarks       | Create a bookmark     | ✅             |
| GET    | /bookmarks       | Get all bookmarks     | ✅             |
| PATCH  | /bookmarks/:id   | Update a bookmark     | ✅             |
| DELETE | /bookmarks/:id   | Delete a bookmark     | ✅             |

## 🧪 Running Tests

End-to-end tests are included using **PactumJS**. To run tests:

```bash
npm run test:e2e
```

## 📂 Project Structure

```
nestjs-api/
│-- src/
│   ├── auth/         # Authentication module
│   ├── bookmarks/    # Bookmarks module
│   ├── prisma/       # Database module
│   ├── users/        # User module
|   ├── app.module.ts # App Module
│   └── main.ts       # Application entry point
├── test/             # E2E tests
├── prisma/           # Prisma schema and migrations
├── .env.example      # Environment variable example
├── docker-compose.yml# Docker setup
└── package.json      # Project dependencies
```

## 🔒 Authentication

- JWT-based authentication is implemented using Passport.js.
- After logging in, users receive a JWT token to access protected routes.

## 📘 Useful Commands

- Start the server: \`npm run start:dev\`
- Run migrations: \`npx prisma migrate dev\`
- Open Prisma Studio: \`npx prisma studio\`
- Run tests: \`npm run test:e2e\`

## 📜 License

This project is licensed under the MIT License.

---

### Credits

- Tutorial by [Vladimir Agaev](https://www.youtube.com/@codewithvlad)
- Project inspired by [FreeCodeCamp's NestJS Course](https://www.youtube.com/watch?v=GHTA143_b-s)
