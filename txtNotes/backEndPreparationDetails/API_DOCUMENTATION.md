# Backend API Documentation

## Overview
This document defines the API contract between the frontend and future backend implementation.

## Base URL
- **Development:** `http://localhost:3000/api`
- **Production:** `https://api.yourdomain.com`

## Authentication
All endpoints (except login) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication

#### POST /auth/login
Login user and receive JWT token.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "Admin" | "Manager" | "User"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Users

#### GET /users
Get paginated list of users.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 4)
- `search` (string, optional)
- `role` (string, optional): "Admin" | "Manager" | "User"
- `status` (string, optional): "Active" | "Inactive"

**Response (200):**
```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "username": "string",
      "email": "string",
      "avatar": "string (URL)",
      "birthDate": "string (DD/MM/YYYY)",
      "phone": "string (optional)",
      "role": "Admin" | "Manager" | "User",
      "status": "Active" | "Inactive"
    }
  ],
  "hasMore": "boolean",
  "total": "number"
}
```

---

#### GET /users/:id
Get single user by ID.

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "username": "string",
  "email": "string",
  "avatar": "string",
  "birthDate": "string",
  "phone": "string",
  "role": "string",
  "status": "string"
}
```

**Response (404):**
```json
{
  "error": "User not found"
}
```

---

#### POST /users
Create new user.

**Permissions:** Admin, Manager

**Request:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "avatar": "string (optional)",
  "birthDate": "string (DD/MM/YYYY)",
  "phone": "string (optional)",
  "role": "Admin" | "Manager" | "User",
  "status": "Active" | "Inactive"
}
```

**Response (201):**
```json
{
  "id": "number",
  "name": "string",
  ...
}
```

**Response (400):**
```json
{
  "error": "Validation error",
  "details": ["field: error message"]
}
```

---

#### PUT /users/:id
Update existing user.

**Permissions:** Admin, Manager

**Request:**
```json
{
  "name": "string (optional)",
  "username": "string (optional)",
  "email": "string (optional)",
  "avatar": "string (optional)",
  "birthDate": "string (optional)",
  "phone": "string (optional)",
  "role": "string (optional)",
  "status": "string (optional)"
}
```

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  ...
}
```

---

#### DELETE /users/:id
Delete user.

**Permissions:** Admin only

**Response (204):** No content

**Response (403):**
```json
{
  "error": "Insufficient permissions"
}
```

---

#### DELETE /users/bulk
Bulk delete users.

**Permissions:** Admin only

**Request:**
```json
{
  "userIds": ["number[]"]
}
```

**Response (200):**
```json
{
  "deleted": "number",
  "message": "Successfully deleted X users"
}
```

---

#### PATCH /users/bulk/role
Bulk update user roles.

**Permissions:** Admin, Manager

**Request:**
```json
{
  "userIds": ["number[]"],
  "role": "Admin" | "Manager" | "User"
}
```

**Response (200):**
```json
{
  "updated": "number",
  "message": "Successfully updated X users"
}
```

---

### 3. Messages

#### POST /messages
Send email to users.

**Request:**
```json
{
  "recipientIds": ["number[]"],
  "subject": "string",
  "body": "string",
  "template": "string (optional)"
}
```

**Response (200):**
```json
{
  "id": "string",
  "sentAt": "string (ISO date)",
  "recipientCount": "number"
}
```

---

#### GET /messages
Get message history.

**Response (200):**
```json
{
  "messages": [
    {
      "id": "string",
      "recipients": ["number[]"],
      "recipientNames": ["string[]"],
      "recipientEmails": ["string[]"],
      "subject": "string",
      "body": "string",
      "template": "string (optional)",
      "sentAt": "string (ISO date)"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)",
  "code": "ERROR_CODE"
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Validation Rules

### User
- `name`: Required, 2-100 characters
- `username`: Required, 3-50 characters, alphanumeric + underscore
- `email`: Required, valid email format
- `birthDate`: Required, format DD/MM/YYYY
- `phone`: Optional, valid phone number format
- `role`: Required, one of: Admin, Manager, User
- `status`: Required, one of: Active, Inactive

### Authentication
- `email`: Required, valid email
- `password`: Required, min 6 characters

---

## CORS Configuration

Backend should allow requests from:
- `http://localhost:5173` (development)
- `https://yourdomain.com` (production)

Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

Allowed headers: Content-Type, Authorization

---

## Rate Limiting

Recommended rate limits:
- Authentication endpoints: 5 requests per minute
- User endpoints: 100 requests per minute
- Message endpoints: 10 requests per minute

---

## Future Enhancements

1. **File Upload** - Avatar image upload endpoint
2. **Analytics** - Endpoint for dashboard statistics
3. **Export** - CSV export endpoint
4. **Webhooks** - Event notifications
5. **Real-time** - WebSocket support for live updates
