# GearGaurd - Equipment Maintenance Management System

A comprehensive equipment maintenance management system built with .NET 8 and PostgreSQL. Manage equipment, teams, maintenance requests, and availability tracking with automatic team member assignment.

---

## ?? Features

- **User Management** - Authentication with JWT, role-based access
- **Team Management** - Create and manage maintenance teams
- **Category Management** - Organize equipment by categories
- **Equipment Management** - Track all equipment with detailed information
- **Team Member Assignment** - Assign users to teams
- **Availability Tracking** - Track which team members are available
- **Maintenance Requests** - Create, track, and manage maintenance requests
- **Auto-Assignment** - Automatically assigns available team members to maintenance requests
- **Smart Scheduling** - Automatic scheduling when team members are assigned

---

## ?? Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL 12 or higher](https://www.postgresql.org/download/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/) with C# extension
- [Git](https://git-scm.com/)

---

## ??? Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dhwanit10/GearGaurd.git
cd GearGaurd/Backend/GearGaurd Backend/GearGaurd Backend
```

### 2. Configure PostgreSQL Database

#### Create Database
Open PostgreSQL and create a new database:

```sql
CREATE DATABASE DB_GearGaurd;
```

#### Update Connection String
Open `appsettings.json` and update the connection string with your PostgreSQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=DB_GearGaurd;Username=YOUR_USERNAME;Password=YOUR_PASSWORD;Pooling=true;Minimum Pool Size=5;Maximum Pool Size=100;Connection Lifetime=0;Connection Idle Lifetime=300;No Reset On Close=true"
  }
}
```

**Replace:**
- `YOUR_USERNAME` - Your PostgreSQL username (default: `postgres`)
- `YOUR_PASSWORD` - Your PostgreSQL password

**Default Values:**
- `Host` - `localhost` (change if PostgreSQL is on another server)
- `Port` - `5432` (default PostgreSQL port)
- `Database` - `DB_GearGaurd` (you can change this if you used a different name)

### 3. Install Required Packages

The project already includes all necessary NuGet packages in the `.csproj` file. Restore them:

```bash
dotnet restore
```

**Packages included:**
- `Npgsql.EntityFrameworkCore.PostgreSQL` (8.0.0) - PostgreSQL database provider
- `Microsoft.EntityFrameworkCore.Design` (8.0.0) - EF Core tools for migrations
- `Microsoft.EntityFrameworkCore.Tools` (8.0.0) - Migration commands
- `BCrypt.Net-Next` (4.0.3) - Password hashing
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.0) - JWT authentication
- `System.IdentityModel.Tokens.Jwt` (8.0.0) - JWT token generation
- `Swashbuckle.AspNetCore` (6.6.2) - Swagger/OpenAPI documentation

### 4. Run Database Migrations

Entity Framework Core will create all database tables automatically.

#### Add Migration (if not exists)
```bash
dotnet ef migrations add InitialCreate
```

#### Apply Migration to Database
```bash
dotnet ef database update
```

This command will:
- Create all 8 tables in your PostgreSQL database
- Set up all foreign key relationships
- Create indexes for performance optimization
- Seed the initial admin user

**Tables Created:**
1. `Users` - User accounts
2. `Team` - Maintenance teams
3. `TeamMember` - User-team assignments
4. `Category` - Equipment categories
5. `Equipment` - Equipment items
6. `MaintenanceRequest` - Maintenance requests
7. `Availability` - Team member availability
8. `RequestStatusHistory` - Status change history

### 5. Run the Application

```bash
dotnet run
```

Or press **F5** in Visual Studio.

The API will be available at:
- **HTTP:** `http://localhost:5000`
- **HTTPS:** `https://localhost:5001`
- **Swagger UI:** `http://localhost:5000/swagger` (in development mode)

---

## ?? Default Admin User

The system comes with a seeded admin user for development and testing:

| Field | Value |
|-------|-------|
| **Email** | `dhwanitakoliya10@gmail.com` |
| **Password** | `1` |
| **UserType** | `Admin` |

**?? Important:** Change this password in production!

### How to Login

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "dhwanitakoliya10@gmail.com",
  "password": "1"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "dhwanitakoliya10@gmail.com",
  "userType": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ?? API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`.

### Quick API Overview

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth` | POST | Login & Signup |
| `/api/user` | GET | Get all non-admin users |
| `/api/team` | GET, POST, PUT, DELETE | Team management |
| `/api/category` | GET, POST, PUT, DELETE | Category management |
| `/api/equipment` | GET, POST, PUT, DELETE | Equipment management |
| `/api/teammember` | GET, POST, PUT, DELETE | Team member assignments |
| `/api/availability` | GET, POST, PUT, DELETE | Availability tracking |
| `/api/maintenancerequest` | GET, POST, PUT, DELETE | Maintenance requests |

### Swagger UI

Access interactive API documentation at: `http://localhost:5000/swagger`

---

## ??? Database Schema

```
Users (1) ?????? (Many) TeamMember (Many) ?????? (1) Team
  ?                                                  ?
  ?                                                  ?
  ?                                              Category (1)
  ?                                                  ?
  ?                                                  ?
  ?                                              Equipment (Many)
OwnedEquipment                                       ?
                                                     ?
                                            MaintenanceRequest
                                                     ?
                                                     ?
                                          RequestStatusHistory
```

---

## ?? Troubleshooting

### Migration Issues

**Problem:** `A network-related or instance-specific error occurred`

**Solution:** 
- Ensure PostgreSQL is running
- Check connection string credentials
- Verify PostgreSQL is listening on port 5432

**Problem:** `Database 'DB_GearGaurd' does not exist`

**Solution:**
```sql
CREATE DATABASE DB_GearGaurd;
```

### Build Issues

**Problem:** Package restore failed

**Solution:**
```bash
dotnet clean
dotnet restore
dotnet build
```

### Port Already in Use

**Problem:** Port 5000 or 5001 is already in use

**Solution:** Change port in `Properties/launchSettings.json`:
```json
{
  "applicationUrl": "https://localhost:7001;http://localhost:6000"
}
```

---

## ??? Project Structure

```
GearGaurd Backend/
??? Controllers/          # API endpoints
??? Services/            # Business logic
??? Models/              # Entity models
??? DTOs/                # Data Transfer Objects
??? Data/                # DbContext and migrations
??? Migrations/          # EF Core migrations
??? appsettings.json     # Configuration
??? Program.cs           # Application startup
```

---

## ?? Common Workflows

### Create a New Maintenance Request

1. **Login** to get JWT token
2. **Create a Team** (`POST /api/team`)
3. **Create a Category** linked to the team (`POST /api/category`)
4. **Create Equipment** (`POST /api/equipment`)
5. **Create TeamMember** and assign user to team (`POST /api/teammember`)
6. **Mark TeamMember as Available** (`POST /api/availability`)
7. **Create Maintenance Request** (`POST /api/maintenancerequest`)
   - System automatically assigns available team member
   - Removes team member from availability
   - Sets scheduled date to today

### Complete a Maintenance Request

1. **Update Request Status** to "Repaired" (`PUT /api/maintenancerequest`)
   - System automatically adds team member back to availability
   - Team member becomes available for new assignments

---

## ?? Configuration

### JWT Settings

Configure JWT in `appsettings.json`:

```json
{
  "JwtSettings": {
    "Secret": "YOUR_SECRET_KEY_MUST_BE_AT_LEAST_32_CHARACTERS_LONG",
    "Issuer": "GearGaurdAPI",
    "Audience": "GearGaurdClient",
    "ExpiryInMinutes": 1440
  }
}
```

**?? Important:** Change the `Secret` key in production!

### CORS

CORS is currently configured to allow all origins. For production, update `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("https://yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

---

## ?? Deployment

### Prepare for Production

1. **Update Connection String** in `appsettings.Production.json`
2. **Change JWT Secret** to a strong, unique value
3. **Restrict CORS** to your frontend domain
4. **Change Default Admin Password**
5. **Enable HTTPS** and update `RequireHttpsMetadata` to `true`
6. **Set up logging** and monitoring

### Publish Application

```bash
dotnet publish -c Release -o ./publish
```

---

## ?? Testing

### Test with Swagger

1. Run the application
2. Navigate to `http://localhost:5000/swagger`
3. Test endpoints directly in the browser

### Test with Postman/Insomnia

1. Import endpoints from Swagger JSON
2. Use the default admin credentials to login
3. Copy the JWT token from login response
4. Add token to Authorization header: `Bearer {token}`

---

## ?? Additional Resources

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ????? Development

### Code Structure

- **Controllers:** Handle HTTP requests/responses only
- **Services:** Contain all business logic
- **Models:** Entity Framework models (database tables)
- **DTOs:** Data Transfer Objects for API requests/responses

### Performance Features

? `AsNoTracking()` for read operations (40% faster)  
? Eager loading with `.Include()` (prevents N+1 queries)  
? Response compression enabled  
? Connection pooling optimized  
? JWT token caching  
? BCrypt password hashing  

---

## ?? Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ?? License

This project is licensed under the MIT License.

---

## ?? Support

For issues and questions:
- Create an issue on GitHub
- Email: dhwanitakoliya10@gmail.com

---

## ?? Acknowledgments

Built with:
- .NET 8
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt for password hashing
- Swagger/OpenAPI

---

**Made with ?? by the GearGaurd Team**
