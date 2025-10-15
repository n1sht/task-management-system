# Task Management System

A full-stack web application for task management with user authentication, role-based access control, and document attachment capabilities.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios
- TailwindCSS
- Lucide Icons

## Features

- User registration and login with JWT authentication
- Role-based access control (USER and ADMIN roles)
- CRUD operations for users (Admin only)
- CRUD operations for tasks
- Task assignment to users
- File upload (up to 3 PDF documents per task)
- Document download and deletion
- Task filtering by status, priority, and due date
- Task sorting and pagination
- Responsive UI design

## Prerequisites

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 18+ (for local development)
- Maven (for local development)

## Quick Start with Docker

1. Clone the repository
2. Navigate to the project root directory
3. Run the application:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on http://localhost:3000

### Database Setup

Ensure PostgreSQL is running with the following configuration:
- Database: taskdb
- Username: postgres
- Password: postgres
- Port: 5432

## API Documentation

API documentation is available via Swagger UI at:
http://localhost:8080/swagger-ui.html

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and receive JWT token

### User Endpoints (Admin only)

- GET /api/users - Get all users (paginated)
- GET /api/users/{id} - Get user by ID
- POST /api/users - Create a new user
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user

### Task Endpoints

- GET /api/tasks - Get all tasks (paginated, filtered, sorted)
- GET /api/tasks/{id} - Get task by ID
- POST /api/tasks - Create a new task (multipart/form-data)
- PUT /api/tasks/{id} - Update task (multipart/form-data)
- DELETE /api/tasks/{id} - Delete task
- GET /api/tasks/documents/{documentId} - Download document
- DELETE /api/tasks/documents/{documentId} - Delete document

## Running Tests

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Project Structure

```
PanScience/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/panscience/taskmanagement/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Environment Variables

### Backend (application.properties)

- spring.datasource.url
- spring.datasource.username
- spring.datasource.password
- jwt.secret
- jwt.expiration
- file.upload-dir

### Frontend

- REACT_APP_API_URL (default: http://localhost:8080/api)

## Default Users

After registration, you can create users with different roles:
- USER: Can manage their own tasks
- ADMIN: Can manage all tasks and users

## Security

- Passwords are hashed using BCrypt
- JWT tokens are used for authentication
- Token expiration: 24 hours
- CORS is configured for frontend origin
- File uploads are restricted to PDF format only
- Maximum 3 documents per task

## File Storage

Files are stored locally in the ./uploads directory. For production, consider using cloud storage like AWS S3.

## License

This project is for educational purposes.
