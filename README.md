# 🚗 Car Rental Platform - Backend API

A robust, scalable backend API for a modern car rental management system built with NestJS, TypeORM, and SQLite.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Database](#database)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This is a comprehensive backend API for a car rental platform that enables seamless management of user authentication, vehicle rentals, user reviews, and admin reporting. The application provides secure authentication mechanisms, role-based access control, and administrative tools for managing the rental platform efficiently.

**Current Version:** v0.0.1

## ✨ Features

### Authentication & User Management

- **User Registration (Signup)** - Create new user accounts with email validation
- **Secure Authentication** - Password hashing and authentication mechanisms
- **User Profile Management** - View, update, and manage user information
- **User Deletion** - Admin capabilities to manage user accounts
- **Email-based Lookup** - Query users by email address

### Admin Management

- **User Administration** - Full CRUD operations on user accounts
- **Reporting System** - Generate and manage rental reports
- **Data Management** - Comprehensive admin dashboard data handling

### User Reviews & Reports

- **Report Generation** - Create detailed reports for rentals
- **Report Management** - Track rental history and vehicle reports
- **Data Serialization** - Secure data handling with custom interceptors

### Technical Features

- ✅ Input validation using class-validator
- ✅ TypeORM database abstraction
- ✅ Global validation pipes
- ✅ Custom serialization interceptors
- ✅ Error handling and exception filters
- ✅ RESTful API design
- ✅ Logging and monitoring

## 🛠 Tech Stack

### Core Framework

- **NestJS** v11.0.1 - Progressive Node.js framework
- **Node.js & Express** - Server runtime and HTTP framework

### Database & ORM

- **TypeORM** v0.3.28 - Advanced Object-Relational Mapping
- **SQLite** v5.1.7 - Lightweight database

### Validation & Serialization

- **class-validator** v0.15.1 - Decorator-based validation
- **class-transformer** v0.5.1 - Object transformation library

### Development Tools

- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 📦 Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** package manager
- **SQLite** (included with sqlite3 npm package)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd car
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   DATABASE_PATH=db.sqlite
   NODE_ENV=development
   ```

## ▶️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The API will be available at `http://localhost:4000` by default.

## 📡 API Endpoints

### Authentication & Users (`/auth`)

| Method   | Endpoint       | Description                      | Body                                    |
| -------- | -------------- | -------------------------------- | --------------------------------------- |
| `POST`   | `/auth/signup` | Register a new user              | `{ email: string, password: string }`   |
| `GET`    | `/auth`        | Get all users or filter by email | Query: `email?`                         |
| `GET`    | `/auth/:id`    | Get user by ID                   | -                                       |
| `PATCH`  | `/auth/:id`    | Update user information          | `{ email?: string, password?: string }` |
| `DELETE` | `/auth/:id`    | Delete user account              | -                                       |

### Reports (`/reports`)

| Method   | Endpoint       | Description         | Body                                 |
| -------- | -------------- | ------------------- | ------------------------------------ |
| `POST`   | `/reports`     | Create a new report | `{ title: string, price: string }`   |
| `GET`    | `/reports`     | Get all reports     | -                                    |
| `GET`    | `/reports/:id` | Get report by ID    | -                                    |
| `PATCH`  | `/reports/:id` | Update report       | `{ title?: string, price?: string }` |
| `DELETE` | `/reports/:id` | Delete report       | -                                    |

### Example Requests

**Signup:**

```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure_password"}'
```

**Get User:**

```bash
curl http://localhost:4000/auth/1
```

**Find Users by Email:**

```bash
curl "http://localhost:4000/auth?email=user@example.com"
```

## 📁 Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts               # Root module configuration
├── app.controller.ts           # Root controller
├── app.service.ts              # Root service
├── interceptors/
│   └── serilaize.interceptor.ts # Data serialization interceptor
├── users/                       # User management module
│   ├── user.entity.ts          # User database entity
│   ├── users.controller.ts     # User API endpoints
│   ├── users.service.ts        # User business logic
│   ├── users.module.ts         # User module configuration
│   └── dtos/
│       ├── create-user-dto.ts  # Create user validation DTO
│       └── update-user-dto.ts  # Update user validation DTO
└── reports/                     # Report management module
    ├── report.entity.ts        # Report database entity
    ├── reports.controller.ts   # Report API endpoints
    ├── reports.service.ts      # Report business logic
    └── reports.module.ts       # Report module configuration

test/                           # E2E tests
├── app.e2e-spec.ts
└── jest-e2e.json
```

## 🗄️ Database

### Schema Overview

**Users Table**

```
id (PrimaryKey)        - Auto-incremented unique identifier
email (String)         - User email address
password (String)      - Hashed password
```

**Reports Table**

```
id (PrimaryKey)        - Auto-incremented unique identifier
title (String)         - Report title
price (String)         - Associated price information
```

### Auto-sync Feature

The application uses TypeORM's `synchronize: true` option, which automatically creates/updates database tables based on entity definitions.

## 🔧 Development

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

### Code Quality

The project includes:

- ESLint configuration for code quality
- Prettier for consistent code formatting
- TypeScript strict mode
- Global validation pipes

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:cov
```

### E2E Tests

```bash
npm run test:e2e
```

## 🔐 Security Features

- ✅ Password field excluded from serialization
- ✅ Input validation on all endpoints
- ✅ Global whitelist validation for DTOs
- ✅ Data transformation and sanitization
- ✅ Error handling with appropriate HTTP status codes

## 📈 Logging

The application includes automatic logging for database operations:

- User insertion logs
- User updates logs
- User deletion logs

## 🚀 Future Enhancements

- [ ] JWT authentication implementation
- [ ] Role-based access control (RBAC)
- [ ] Car inventory management module
- [ ] Reservation/booking system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] File upload for documents
- [ ] API rate limiting
- [ ] Comprehensive unit and E2E tests

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED license. All rights reserved.

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Happy coding! 🚀**

Last Updated: 2026
