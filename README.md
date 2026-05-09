# Technoedge MVP System Architecture V1

Integrated Business Management Platform MVP for:

- Project Management
- Task Management
- Kanban Board
- Workflow Engine
- Basic CRM
- Basic HRMS
- Notifications
- Dashboard / Reports

This repository is a development-ready architecture starter. It is intentionally built as a modular monolith so the MVP can be developed quickly without microservice complexity.

## MVP Architecture

```text
Users
  -> React Frontend
  -> NestJS Backend / API Gateway
  -> Authentication + RBAC
  -> Business Modules
      -> Project & Task Management
      -> Workflow Engine
      -> CRM
      -> HRMS
      -> Notifications
      -> Dashboard
  -> PostgreSQL Database
  -> File Storage + Email / Background Jobs
```

## Core MVP Rule

Keep the Workflow Engine separate from Project & Task Management.

The Task module stores task data. The Workflow module controls status movement, transition rules, approval rules, and workflow history.

## Quick Start

### 1. Start database

```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## MVP Login Seed Recommendation

Create the first admin user from database seed or admin panel.

```text
Email: admin@techedgels.com
Password: Admin@12345
Role: SUPER_ADMIN
```

## Not Included in MVP

- Payroll
- Advanced AI / analytics
- Advanced automation rules
- Mobile app
- Multi-branch complexity
- Complex CRM revenue forecasting
- Complex HR policies
