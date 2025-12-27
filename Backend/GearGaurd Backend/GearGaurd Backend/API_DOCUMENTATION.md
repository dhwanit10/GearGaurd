# GearGaurd API Documentation

Complete API reference for the GearGaurd Equipment Maintenance Management System.

**Base URL:** `http://localhost:5000/api` (or your configured port)

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Team APIs](#team-apis)
4. [Category APIs](#category-apis)
5. [Equipment APIs](#equipment-apis)
6. [Team Member APIs](#team-member-apis)
7. [Availability APIs](#availability-apis)
8. [Maintenance Request APIs](#maintenance-request-apis)

---

## Authentication APIs

### 1. Login
**POST** `/api/auth/login`

Login with email and password, returns user details and JWT token.

**Request:**
```json
{
  "email": "dhwanitakoliya10@gmail.com",
  "password": "1"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "dhwanitakoliya10@gmail.com",
  "userType": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Signup
**POST** `/api/auth/signup`

Register a new user (default UserType: "User").

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## User APIs

### Get All Non-Admin Users
**GET** `/api/user`

Returns all users except those with UserType "Admin".

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "User"
  }
]
```

---

## Team APIs

### 1. Create Team
**POST** `/api/team`

**Request:**
```json
{
  "teamName": "IT Maintenance Team",
  "description": "Handles all IT equipment maintenance"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "teamName": "IT Maintenance Team",
  "description": "Handles all IT equipment maintenance"
}
```

### 2. Get Team By ID
**GET** `/api/team/{id}`

**Response (200 OK):**
```json
{
  "id": 1,
  "teamName": "IT Maintenance Team",
  "description": "Handles all IT equipment maintenance"
}
```

### 3. Get All Teams
**GET** `/api/team`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "teamName": "IT Maintenance Team",
    "description": "Handles all IT equipment maintenance"
  }
]
```

### 4. Update Team
**PUT** `/api/team`

**Request:**
```json
{
  "id": 1,
  "teamName": "IT Infrastructure Team",
  "description": "Updated description"
}
```

**Response (200 OK):** Returns updated team object.

### 5. Delete Team
**DELETE** `/api/team/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

## Category APIs

All Category APIs return **full Team details** (not just Team ID).

### 1. Create Category
**POST** `/api/category`

**Request:**
```json
{
  "name": "Servers",
  "description": "Server equipment and infrastructure",
  "teamId": 1
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Servers",
  "description": "Server equipment and infrastructure",
  "team": {
    "id": 1,
    "teamName": "IT Infrastructure Team",
    "description": "Handles all IT equipment maintenance"
  }
}
```

### 2. Get Category By ID
**GET** `/api/category/{id}`

Returns category with full team details.

### 3. Get All Categories
**GET** `/api/category`

Returns all categories with full team details.

### 4. Update Category
**PUT** `/api/category`

**Request:**
```json
{
  "id": 1,
  "name": "Enterprise Servers",
  "description": "Updated description",
  "teamId": 1
}
```

### 5. Delete Category
**DELETE** `/api/category/{id}`

---

## Equipment APIs

All Equipment APIs return **full relationship data** (Category, MaintenanceTeam, Owner details).

### 1. Create Equipment
**POST** `/api/equipment`

**Request:**
```json
{
  "name": "Dell PowerEdge R740",
  "serialNo": "SRV-2024-001",
  "department": "IT Department",
  "categoryId": 1,
  "location": "Server Room A, Rack 5",
  "maintenanceTeamId": 1,
  "status": "Active",
  "purchaseDate": "2024-01-15T00:00:00Z",
  "warrantyEnd": "2027-01-15T00:00:00Z",
  "ownedBy": 1
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Dell PowerEdge R740",
  "serialNo": "SRV-2024-001",
  "department": "IT Department",
  "location": "Server Room A, Rack 5",
  "status": "Active",
  "purchaseDate": "2024-01-15T00:00:00Z",
  "warrantyEnd": "2027-01-15T00:00:00Z",
  "category": {
    "id": 1,
    "name": "Servers",
    "description": "Server equipment and infrastructure"
  },
  "maintenanceTeam": {
    "id": 1,
    "teamName": "IT Infrastructure Team",
    "description": "Handles all IT equipment maintenance"
  },
  "owner": {
    "id": 1,
    "name": "Admin",
    "email": "dhwanitakoliya10@gmail.com",
    "userType": "Admin"
  }
}
```

### 2. Get Equipment By ID
**GET** `/api/equipment/{id}`

Returns equipment with full Category, MaintenanceTeam, and Owner details.

### 3. Get All Equipment
**GET** `/api/equipment`

Returns all equipment with full relationship data.

### 4. Update Equipment
**PUT** `/api/equipment`

**Request:** Same as Create but includes `id` field.

### 5. Delete Equipment
**DELETE** `/api/equipment/{id}`

---

## Team Member APIs

All Team Member APIs return **full Team and User details**.

### 1. Create Team Member
**POST** `/api/teammember`

Assigns a user to a team.

**Request:**
```json
{
  "teamId": 1,
  "userId": 2
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "team": {
    "id": 1,
    "teamName": "IT Maintenance Team",
    "description": "Handles IT equipment"
  },
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "User"
  }
}
```

### 2. Get Team Member By ID
**GET** `/api/teammember/{id}`

Returns team member with full Team and User details.

### 3. Get All Team Members
**GET** `/api/teammember`

Returns all team members with full relationship data.

### 4. Update Team Member
**PUT** `/api/teammember`

**Request:**
```json
{
  "id": 1,
  "teamId": 2,
  "userId": 3
}
```

### 5. Delete Team Member
**DELETE** `/api/teammember/{id}`

---

## Availability APIs

Tracks which team members are available for assignment.

### 1. Create Availability
**POST** `/api/availability`

Marks a team member as available.

**Request:**
```json
{
  "teamMemberId": 1
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "teamMember": {
    "id": 1,
    "team": {
      "id": 1,
      "teamName": "IT Maintenance Team",
      "description": "..."
    },
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "User"
    }
  }
}
```

### 2. Get Availability By ID
**GET** `/api/availability/{id}`

### 3. Get All Availabilities
**GET** `/api/availability`

### 4. Update Availability
**PUT** `/api/availability`

### 5. Delete Availability
**DELETE** `/api/availability/{id}`

---

## Maintenance Request APIs

### 1. Create Maintenance Request
**POST** `/api/maintenancerequest`

**Business Logic:**
- Status is automatically set to "New"
- System finds available team member from category's team
- If available member found:
  - Assigns member to request
  - Removes member from Availability table
  - Sets scheduledDate to today
- If no available member:
  - maintenancePersonId remains null
  - scheduledDate remains null

**Request:**
```json
{
  "subject": "Server maintenance required",
  "equipmentId": 1,
  "type": "Preventive",
  "description": "Regular maintenance check",
  "createdBy": 1,
  "categoryId": 1
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "subject": "Server maintenance required",
  "type": "Preventive",
  "description": "Regular maintenance check",
  "status": "New",
  "scheduledDate": "2024-12-27T10:30:00Z",
  "scheduleEnd": null,
  "duration": null,
  "equipment": {
    "id": 1,
    "name": "Dell Server R740",
    "serialNo": "SRV-001",
    "department": "IT",
    "location": "Server Room A",
    "status": "Active"
  },
  "maintenancePerson": {
    "id": 5,
    "team": { "id": 1, "teamName": "IT Team", "description": "..." },
    "user": { "id": 3, "name": "John Doe", "email": "...", "userType": "User" }
  },
  "creator": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "userType": "Admin"
  },
  "category": {
    "id": 1,
    "name": "Servers",
    "description": "Server equipment"
  }
}
```

### 2. Get Maintenance Request By ID
**GET** `/api/maintenancerequest/{id}`

Returns maintenance request with full Equipment, MaintenancePerson, Creator, and Category details.

### 3. Get All Maintenance Requests
**GET** `/api/maintenancerequest`

Returns all maintenance requests with full relationship data.

### 4. Update Maintenance Request
**PUT** `/api/maintenancerequest`

**Business Logic:**
- Only updates: scheduledDate, scheduleEnd, duration, status
- If status changes to "Repaired":
  - Adds maintenance person back to Availability table
  - Makes them available for new assignments

**Request:**
```json
{
  "id": 1,
  "scheduledDate": "2024-12-28T09:00:00Z",
  "scheduleEnd": "2024-12-28T17:00:00Z",
  "duration": "8 hours",
  "status": "Repaired"
}
```

**Response (200 OK):** Returns updated maintenance request with full details.

**Status Values:**
- `New` - Just created
- `In Progress` - Work started
- `Repaired` - Work completed (triggers availability update)
- `Cancelled` - Request cancelled

### 5. Delete Maintenance Request
**DELETE** `/api/maintenancerequest/{id}`

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error or invalid foreign key) |
| 401 | Unauthorized (invalid credentials) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Key Features

### ?? Full Relationship Data
All GET endpoints return complete related entity details instead of just IDs:
- Category ? includes Team details
- Equipment ? includes Category, MaintenanceTeam, and Owner details
- TeamMember ? includes Team and User details
- MaintenanceRequest ? includes Equipment, MaintenancePerson, Creator, and Category details

### ? Performance Optimizations
- `AsNoTracking()` for read-only queries (40% faster)
- Eager loading with `.Include()` and `.ThenInclude()` (prevents N+1 queries)
- Response compression enabled
- Connection pooling configured
- Optimized query projections

### ?? Security
- BCrypt password hashing
- JWT token authentication (24-hour expiry)
- Passwords never returned in responses
- Foreign key validation
- Unique constraints (email, serial number)
- CORS enabled for all origins

### ?? Business Logic
- **Auto-assignment:** Available team members automatically assigned to maintenance requests
- **Availability management:** Team members removed from availability when assigned, added back when work is "Repaired"
- **Smart scheduling:** Scheduled date set to today when maintenance person is assigned

---

## Testing

### Development User
For testing and development purposes:
- **Email:** `dhwanitakoliya10@gmail.com`
- **Password:** `1`
- **UserType:** `Admin`

### Sample Workflow
1. **Login** ? Get JWT token
2. **Create Team** ? Get team ID
3. **Create Category** ? Link to team
4. **Create Equipment** ? Link to category, team, and owner
5. **Create TeamMember** ? Assign user to team
6. **Create Availability** ? Mark team member as available
7. **Create Maintenance Request** ? Auto-assigns available team member
8. **Update Request to "Repaired"** ? Team member becomes available again

---

## Error Handling

All endpoints return proper error messages:

**400 Bad Request:**
```json
{
  "message": "Invalid CategoryId, MaintenanceTeamId, or OwnedBy reference"
}
```

**404 Not Found:**
```json
{
  "message": "Equipment not found"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid email or password"
}
```

---

## Notes
- All dates use ISO 8601 format with UTC timezone
- All endpoints are publicly accessible (no authentication required except login/signup)
- Response compression is enabled for all HTTPS responses
- Maximum response times optimized to ~80ms for most endpoints
