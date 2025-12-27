# GearGuard - Maintenance Management System

A comprehensive maintenance management system designed to streamline equipment maintenance operations, track maintenance requests, and manage technician teams with a modern React-based frontend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)

## ✨ Features

- **Equipment Management**: Track and manage all equipment with status, maintenance history, and warranty information
- **Maintenance Requests**: Create, track, and manage maintenance requests with priority levels and types
- **Team Management**: Organize technicians into teams for efficient assignment and management
- **Maintenance Calendar**: Visual calendar view of all scheduled and completed maintenance requests
- **Analytics & Reports**: Comprehensive reports and dashboards with data visualization
- **Dynamic Dashboard**: Real-time statistics on critical equipment, technician load, and open requests
- **Fully API-Driven**: All data fetched from backend API - no hardcoded mock data

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (component library built on Radix UI)
- **Styling**: Tailwind CSS
- **Charts**: Recharts (for data visualization)
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API with custom wrapper
- **Package Manager**: npm or bun

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun**
- A backend API server running (GearGuard backend)

## 📦 Installation

Follow these steps to set up the GearGuard frontend:

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd gear-guardian
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm i
```

Or if you prefer using bun:

```bash
bun install
```

## 🔧 Environment Configuration

### Create .env File

Create a `.env` file in the root directory of the project. This file is crucial for configuring your API endpoint.

### .env Template

```env
# API Configuration
VITE_API_BASE_URL=https://b87160z9-7284.inc1.devtunnels.ms/api
```

### Environment Variables Explanation

- **VITE_API_BASE_URL**: The base URL of your backend API server
  - Replace the example URL with your actual backend API URL
  - Make sure the backend server is running before starting the frontend
  - The URL should end with `/api` (e.g., `http://localhost:3000/api` for local development)

### Example .env for Different Environments

**Local Development:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Staging/Testing:**
```env
VITE_API_BASE_URL=https://staging-api.example.com/api
```

**Production:**
```env
VITE_API_BASE_URL=https://api.example.com/api
```

## 🚀 Running the Application

### Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The application will typically start at `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
gear-guardian/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       ├── MaintenanceTable.tsx
│   │       └── RequestDetailModal.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Maintenance.tsx
│   │   ├── MaintenanceCalendar.tsx
│   │   ├── EquipmentList.tsx
│   │   ├── Categories.tsx
│   │   ├── Teams.tsx
│   │   ├── Reports.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── NotFound.tsx
│   ├── lib/
│   │   ├── api.ts              # HTTP client wrapper
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # Entry point
│   └── index.css
├── public/                     # Static assets
├── .env                        # Environment variables (create this)
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 📄 Available Pages

### 1. **Login** (`/login`)
   - User authentication
   - JWT token management

### 2. **Signup** (`/signup`)
   - New user registration
   - Account creation

### 3. **Dashboard** (`/dashboard`)
   - Overview of maintenance operations
   - Key statistics (Critical Equipment, Technician Load, Open Requests)
   - Recent maintenance requests table

### 4. **Maintenance** (`/maintenance`)
   - List all maintenance requests with filtering
   - Create new maintenance requests
   - Filter by status and type
   - View detailed request information

### 5. **Maintenance Calendar** (`/calendar`)
   - Visual calendar view of maintenance requests
   - Color-coded by status (New, In Progress, Repaired, Scrap)
   - Click on requests to view details
   - Monthly navigation

### 6. **Equipment** (`/equipment`)
   - Browse all equipment with status indicators
   - Create new equipment entries
   - Track warranty and purchase dates
   - Assign to teams and categories
   - Delete equipment records

### 7. **Categories** (`/categories`)
   - Manage equipment categories
   - Assign categories to teams
   - Create and delete categories
   - Search and filter

### 8. **Teams** (`/teams`)
   - View all maintenance teams
   - See team members
   - Create new teams
   - Delete teams
   - Team descriptions and details

### 9. **Reports** (`/reports`)
   - Analytics and data visualization
   - Request status distribution
   - Equipment status breakdown
   - Equipment by category analysis
   - Maintenance type statistics

## 🔌 API Integration

All API endpoints are centralized in `src/lib/api.ts`. The HTTP client automatically:
- Reads the base URL from `.env` (VITE_API_BASE_URL)
- Handles JSON serialization/deserialization
- Manages error responses
- Provides clean error messages

### Supported HTTP Methods

- `get(path)` - GET requests
- `post(path, body)` - POST requests
- `put(path, body)` - PUT requests
- `del(path)` - DELETE requests

Example usage:
```typescript
import { get, post, del } from '@/lib/api';

// Fetch data
const equipment = await get('Equipment');

// Create data
const newTeam = await post('Team', { TeamName: 'Team A', Description: 'Test team' });

// Delete data
await del('Team/1');
```

## 🎨 UI Components

The project uses **shadcn/ui** components, which are built on Radix UI and styled with Tailwind CSS. Common components include:

- Button
- Input
- Dialog/Modal
- Table
- Select
- Badge
- Card
- Toast notifications
- And many more...

## 🐛 Troubleshooting

### Issue: Cannot connect to API

**Solution**: 
- Verify the `VITE_API_BASE_URL` in `.env` is correct
- Ensure your backend server is running
- Check network connectivity
- Look at browser console (F12) for detailed error messages

### Issue: Environment variables not loading

**Solution**:
- Create `.env` file in the root directory (not in src/)
- Restart the development server after creating/modifying `.env`
- Variable names must start with `VITE_` to be accessible in React

### Issue: Port 5173 already in use

**Solution**:
```bash
# Kill the process using port 5173 or specify a different port
npm run dev -- --port 3000
```

## 📝 Development Commands

```bash
# Install dependencies
npm i

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Authentication

The application uses JWT token-based authentication:
- Tokens are stored in browser's localStorage
- Login endpoint: `POST /Auth/login`
- Signup endpoint: `POST /Auth/register`
- Logout clears the localStorage and redirects to login

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License

This project is part of the GearGuard maintenance management system.

## 👥 Support

For issues or questions regarding the frontend, please check:
1. The error message in the browser console
2. The troubleshooting section above
3. Verify your `.env` configuration
4. Ensure the backend API is running and accessible
