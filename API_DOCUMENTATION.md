# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "role": "USER",
  "userId": 1
}
```

### Login

**POST** `/auth/login`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "role": "USER",
  "userId": 1
}
```

## User Endpoints (Admin Only)

### Get All Users

**GET** `/users`

Query Parameters:
- `page` (default: 0)
- `size` (default: 10)
- `sortBy` (default: id)
- `sortDir` (default: asc)

Response:
```json
{
  "content": [
    {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "number": 0,
  "size": 10
}
```

### Get User by ID

**GET** `/users/{id}`

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "USER"
}
```

### Create User

**POST** `/users`

Request Body:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "USER"
}
```

Response:
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "role": "USER"
}
```

### Update User

**PUT** `/users/{id}`

Request Body:
```json
{
  "email": "updated@example.com",
  "password": "newpassword",
  "role": "ADMIN"
}
```

Response:
```json
{
  "id": 1,
  "email": "updated@example.com",
  "role": "ADMIN"
}
```

### Delete User

**DELETE** `/users/{id}`

Response: 204 No Content

## Task Endpoints

### Get All Tasks

**GET** `/tasks`

Query Parameters:
- `status` (optional: TODO, IN_PROGRESS, DONE)
- `priority` (optional: LOW, MEDIUM, HIGH)
- `dueDate` (optional: YYYY-MM-DD)
- `page` (default: 0)
- `size` (default: 10)
- `sortBy` (default: id)
- `sortDir` (default: asc)

Response:
```json
{
  "content": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2024-12-31",
      "assignedToId": 2,
      "assignedToEmail": "user@example.com",
      "createdById": 1,
      "createdByEmail": "admin@example.com",
      "documents": [
        {
          "id": 1,
          "fileName": "document.pdf",
          "fileType": "application/pdf",
          "fileSize": 1024
        }
      ]
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "number": 0,
  "size": 10
}
```

### Get Task by ID

**GET** `/tasks/{id}`

Response:
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "assignedToId": 2,
  "assignedToEmail": "user@example.com",
  "createdById": 1,
  "createdByEmail": "admin@example.com",
  "documents": []
}
```

### Create Task

**POST** `/tasks`

Content-Type: `multipart/form-data`

Form Data:
- `title` (required)
- `description` (optional)
- `status` (required: TODO, IN_PROGRESS, DONE)
- `priority` (required: LOW, MEDIUM, HIGH)
- `dueDate` (required: YYYY-MM-DD)
- `assignedToId` (optional)
- `files` (optional, max 3 PDF files)

Response:
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "assignedToId": 2,
  "assignedToEmail": "user@example.com",
  "createdById": 1,
  "createdByEmail": "admin@example.com",
  "documents": []
}
```

### Update Task

**PUT** `/tasks/{id}`

Content-Type: `multipart/form-data`

Form Data:
- `title` (required)
- `description` (optional)
- `status` (required: TODO, IN_PROGRESS, DONE)
- `priority` (required: LOW, MEDIUM, HIGH)
- `dueDate` (required: YYYY-MM-DD)
- `assignedToId` (optional)
- `files` (optional, max 3 PDF files total)

Response:
```json
{
  "id": 1,
  "title": "Updated Task Title",
  "description": "Updated Description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2024-12-31",
  "assignedToId": 2,
  "assignedToEmail": "user@example.com",
  "createdById": 1,
  "createdByEmail": "admin@example.com",
  "documents": []
}
```

### Delete Task

**DELETE** `/tasks/{id}`

Response: 204 No Content

### Download Document

**GET** `/tasks/documents/{documentId}`

Response: Binary PDF file

### Delete Document

**DELETE** `/tasks/documents/{documentId}`

Response: 204 No Content

## Status Codes

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Error Response Format

```json
{
  "timestamp": "2024-01-01T00:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tasks"
}
```
