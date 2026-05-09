# 01. MVP System Architecture

## Product Goal

Build a first usable version of an Integrated Business Management Platform.

The MVP should help the company manage daily work through one system:

- Users and roles
- Departments
- Projects
- Tasks
- Kanban status tracking
- Basic workflow rules
- Basic CRM leads
- Basic HRMS employee records
- Notifications
- Basic dashboard

## Recommended Architecture Pattern

Use a modular monolith.

A modular monolith means there is one backend application, but the code is divided into clear business modules.

## Why Modular Monolith for MVP

| Reason | Explanation |
|---|---|
| Faster delivery | One backend is quicker to build |
| Lower cost | No complex DevOps at the start |
| Easier debugging | All business logic is in one codebase |
| Clean future scaling | Modules can later become services |
| Better MVP control | Small team can maintain it |

## High-Level Flow

```text
User
 ↓
React Frontend
 ↓
API Gateway / NestJS Backend
 ↓
Authentication + RBAC
 ↓
Business Modules
 ├── Project & Task Management
 ├── Workflow Engine
 ├── CRM Module
 ├── HRMS Module
 ├── Notifications Module
 └── Dashboard / Reports Module
 ↓
PostgreSQL Database
 ↓
File Storage + Email + Background Jobs
```

## Layer Details

### 1. Users

Users access the platform through a browser.

MVP user groups:

- Admin / Super Admin
- Management / Directors
- Department Heads
- Employees
- HR Team
- Sales / CRM Team
- Clients / External Users

### 2. Presentation Layer

Frontend should be a React web application.

MVP screens:

- Login
- Dashboard
- Projects
- Tasks
- Kanban Board
- CRM Leads
- HRMS Employees
- Notifications
- Settings

### 3. API Gateway / Backend

The backend should expose REST APIs.

Responsibilities:

- Receive frontend requests
- Validate input
- Check authentication
- Check role permission
- Call business modules
- Save data in PostgreSQL
- Return response to frontend

### 4. Authentication + RBAC

Authentication verifies who the user is.

RBAC verifies what the user can do.

MVP roles:

- SUPER_ADMIN
- ADMIN
- MANAGEMENT
- DEPARTMENT_HEAD
- EMPLOYEE
- HR
- SALES
- CLIENT

### 5. Business Modules

Business modules should be separate in code.

MVP modules:

- Auth
- Users
- Departments
- Projects
- Tasks
- Workflow
- CRM
- HRMS
- Notifications
- Dashboard

### 6. Data Layer

Use PostgreSQL as the main database.

Use local file storage for MVP attachments. Move to S3-compatible storage later.

### 7. Background Jobs

For MVP, background jobs can be simple.

Use them for:

- Email notifications
- Reminder notifications
- Heavy report generation later

Redis + BullMQ can be added after the first working version.

## Out of MVP

| Feature | Reason |
|---|---|
| Payroll | Compliance-heavy |
| AI / analytics | Not needed initially |
| Advanced automation | Build after workflow is stable |
| Complex CRM | Start with leads only |
| Mobile app | Web app first |
| Multi-branch setup | Add after one branch works |
