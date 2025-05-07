# Todo Backend API Documentation

## User APIs

### 1. Get All Users
- **Endpoint:** `GET /users`
- **Description:** Get all users
- **Response Structure:**
```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string"
  }
]
```
- **Error Response (500):**
```json
{
  "error": "Failed to fetch users"
}
```

### 2. Get User by ID
- **Endpoint:** `GET /users/:id`
- **Description:** Get user by ID
- **Response Structure:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```
- **Error Responses:**
  - 404: `{ "error": "User not found" }`
  - 500: `{ "error": "Failed to fetch user" }`

### 3. Get User Todos
- **Endpoint:** `GET /users/:userId/todos`
- **Description:** Get todos for a specific user with pagination, filtering, and sorting
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `sortBy` (optional): Field to sort by (default: 'createdAt')
  - `sortOrder` (optional): 'ASC' or 'DESC' (default: 'ASC')
  - `status` (optional): Filter by completion status
  - `priority` (optional): Filter by priority
  - `tags` (optional): Filter by tags
  - `search` (optional): Search in title and description
- **Response Structure:**
```json
{
  "todos": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "string",
      "completed": boolean,
      "tags": ["string"],
      "createdAt": "date",
      "updatedAt": "date",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string"
      },
      "notes": [
        {
          "id": "string",
          "content": "string",
          "createdAt": "date"
        }
      ]
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```
- **Error Response (500):**
```json
{
  "error": "Failed to fetch user todos"
}
```

## Todo APIs

### 1. Get All Todos
- **Endpoint:** `GET /todos`
- **Description:** Get all todos for current user
- **Required Query Parameter:** `user` (user ID)
- **Response Structure:** Same as GET /users/:userId/todos

### 2. Get Todo by ID
- **Endpoint:** `GET /todos/:id`
- **Description:** Get a specific todo by ID
- **Required Query Parameter:** `user` (user ID)
- **Response Structure:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "priority": "string",
  "completed": boolean,
  "tags": ["string"],
  "createdAt": "date",
  "updatedAt": "date",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "notes": [
    {
      "id": "string",
      "content": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```
- **Error Responses:**
  - 400: `{ "error": "User ID is required" }`
  - 404: `{ "error": "Todo not found" }`
  - 500: `{ "error": "Failed to fetch todo" }`

### 3. Create Todo
- **Endpoint:** `POST /todos`
- **Description:** Create a new todo
- **Required Query Parameter:** `user` (user ID)
- **Request Body:**
```json
{
  "title": "string", // required
  "description": "string",
  "priority": "string", // optional, one of: "low", "medium", "high"
  "tags": ["string"], // optional
  "assignedUsers": ["string"] // optional
}
```
- **Response:** Created todo object
- **Error Responses:**
  - 400: `{ "error": "Title is required" }` or validation errors
  - 500: `{ "error": "Failed to create todo" }`

### 4. Update Todo
- **Endpoint:** `PUT /todos/:id`
- **Description:** Update an existing todo
- **Required Query Parameter:** `user` (user ID)
- **Request Body:** Same as POST /todos
- **Response:** Updated todo object
- **Error Responses:**
  - 400: `{ "error": "User ID is required" }` or validation errors
  - 404: `{ "error": "Todo not found" }`
  - 500: `{ "error": "Failed to update todo" }`

### 5. Delete Todo
- **Endpoint:** `DELETE /todos/:id`
- **Description:** Delete a todo
- **Required Query Parameter:** `user` (user ID)
- **Response:**
```json
{
  "message": "Todo deleted successfully"
}
```
- **Error Responses:**
  - 400: `{ "error": "User ID is required" }`
  - 404: `{ "error": "Todo not found" }`
  - 500: `{ "error": "Failed to delete todo" }`

### 6. Add Note to Todo
- **Endpoint:** `POST /todos/:todoId/notes`
- **Description:** Add a note to a todo
- **Required Query Parameter:** `user` (user ID)
- **Request Body:**
```json
{
  "content": "string" // required
}
```
- **Response:** Created note object
- **Error Responses:**
  - 400: `{ "error": "Note content is required" }`
  - 404: `{ "error": "Todo not found" }`
  - 500: `{ "error": "Failed to add note" }`

### 7. Export Todos
- **Endpoint:** `GET /todos/export`
- **Description:** Export todos
- **Required Query Parameter:** `user` (user ID)
- **Optional Query Parameter:** `format` (default: 'json', can be 'csv')
- **Response:** JSON array of todos or CSV file
- **Error Responses:**
  - 400: `{ "error": "User ID is required" }`
  - 500: `{ "error": "Failed to export todos" }`

---

**Note:** All endpoints that return errors will include appropriate HTTP status codes (400 for bad requests, 404 for not found, 500 for server errors). 