# 🛠️ GearGuard – The Ultimate Maintenance Tracker

GearGuard is a **full-stack, dynamic maintenance management web application** designed to help organizations efficiently **track equipment**, **manage maintenance requests**, and **automatically assign technicians** based on availability and team specialization.

The system closely follows real-world industrial maintenance workflows and provides **Kanban** and **Calendar** views for better visibility and planning.

---

## 📌 Project Overview

In many organizations, maintenance operations are handled manually, which leads to:
- Delayed issue resolution
- Poor visibility into equipment history
- Uneven workload distribution among technicians
- Missed preventive maintenance schedules

**GearGuard solves these problems** by digitally connecting:
- **Equipment** (what needs maintenance)
- **Teams & Technicians** (who performs the work)
- **Maintenance Requests** (the work itself)

---

## 🚀 Key Features

- 📋 Centralized equipment management
- 🧑‍🔧 Maintenance teams and technicians
- ⚙️ **Automatic task assignment using technician availability**
- 🟦 Kanban board for maintenance workflow
- 🗓️ Calendar view for preventive maintenance
- ⏱️ Technician workload and scheduling tracking
- 🔐 Role-based access control
- 🗑️ Scrap logic for unusable equipment
- 🧩 Scalable and extensible architecture

---


## 🧱 Tech Stack

### Frontend
- **React**
- **Vite**
- JavaScript (ES6+)
- REST API integration

### Backend
- **ASP.NET Core (C#)**
- RESTful Web APIs
- Entity Framework Core (Code-First)
- JWT-based Authentication

### Database
- **PostgreSQL**
- EF Core Migrations
- Relational schema design

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
        |
        | REST APIs (JWT-secured)
        |
Backend (ASP.NET Core)
        |
        | Entity Framework Core
        |
Database (PostgreSQL)
