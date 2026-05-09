# SPMS ERD And Flowcharts

Copy these Mermaid diagrams into any Mermaid-compatible editor, Markdown preview, or documentation tool.

## Entity Relationship Diagram

```mermaid
erDiagram
  User {
    String id PK
    String name
    String email UK
    String passwordHash
    UserStatus status
    String departmentId FK
    DateTime createdAt
    DateTime updatedAt
  }

  Role {
    String id PK
    String name UK
    DateTime createdAt
    DateTime updatedAt
  }

  UserRole {
    String id PK
    String userId FK
    String roleId FK
  }

  Department {
    String id PK
    String name UK
    DateTime createdAt
    DateTime updatedAt
  }

  Project {
    String id PK
    String name
    String description
    ProjectStatus status
    String departmentId FK
    DateTime createdAt
    DateTime updatedAt
  }

  Task {
    String id PK
    String title
    String description
    TaskPriority priority
    DateTime dueDate
    String projectId FK
    String assigneeId FK
    String createdById FK
    String statusId FK
    DateTime createdAt
    DateTime updatedAt
  }

  WorkflowDefinition {
    String id PK
    String name
    String module
    DateTime createdAt
    DateTime updatedAt
  }

  WorkflowState {
    String id PK
    String name
    Int order
    String workflowId FK
    DateTime createdAt
    DateTime updatedAt
  }

  WorkflowTransition {
    String id PK
    String workflowId FK
    String fromStateId
    String toStateId
    String allowedRole
    String actionName
    DateTime createdAt
    DateTime updatedAt
  }

  TaskStatusHistory {
    String id PK
    String taskId FK
    String fromStatus
    String toStatus
    String changedById
    DateTime changedAt
  }

  TaskComment {
    String id PK
    String message
    String taskId FK
    String userId FK
    DateTime createdAt
    DateTime updatedAt
  }

  Notification {
    String id PK
    String title
    String message
    Boolean isRead
    String userId
    DateTime createdAt
    DateTime updatedAt
  }

  Department ||--o{ User : has
  Department ||--o{ Project : owns
  User ||--o{ UserRole : has
  Role ||--o{ UserRole : assigned_to
  Project ||--o{ Task : contains
  User ||--o{ Task : assigned_tasks
  User ||--o{ Task : created_tasks
  WorkflowDefinition ||--o{ WorkflowState : has
  WorkflowDefinition ||--o{ WorkflowTransition : defines
  WorkflowState ||--o{ Task : current_status
  Task ||--o{ TaskComment : has
  User ||--o{ TaskComment : writes
  Task ||--o{ TaskStatusHistory : records
```

## Database Setup Flow

```mermaid
flowchart TD
  A[Start Docker Compose] --> B[PostgreSQL Container: spms_postgres]
  B --> C[Database: spms_ibmp]
  C --> D[User: spms_user]
  D --> E[Backend .env DATABASE_URL]
  E --> F[Prisma Config Reads DATABASE_URL]
  F --> G[Prisma Migrate Applies Tables]
  G --> H[Prisma Generate Creates Client]
  H --> I[NestJS Backend Uses PrismaService]
  C --> J[pgAdmin Container]
  J --> K[Connect Host: postgres Port: 5432]
```

## User And Role Flow

```mermaid
flowchart TD
  A[Create User] --> B[Hash Password]
  B --> C[Save User.passwordHash]
  C --> D[Assign Role Through UserRole]
  D --> E[User Can Have Multiple Roles]
  E --> F[Role Can Belong To Multiple Users]
  C --> G[Optional Department Assignment]
```

## Project And Task Flow

```mermaid
flowchart TD
  A[Create Department] --> B[Create Project]
  B --> C[Project Status: ACTIVE]
  C --> D[Create Task]
  D --> E[Set Priority]
  D --> F[Set Creator]
  D --> G[Optional Assignee]
  D --> H[Set Current Workflow State]
  H --> I[Task Appears In Workflow/Kanban Stage]
```

## Workflow State Flow

```mermaid
flowchart LR
  A[Open] --> B[Assigned]
  B --> C[In Progress]
  C --> D[Review]
  D --> E[Done]
```

## Task Status Change Flow

```mermaid
flowchart TD
  A[User Requests Status Change] --> B[Check WorkflowTransition]
  B --> C{Allowed Role?}
  C -- No --> D[Reject Change]
  C -- Yes --> E[Update Task.statusId]
  E --> F[Create TaskStatusHistory]
  F --> G[Create Notification]
  G --> H[Task Updated Successfully]
```

## Comment Flow

```mermaid
flowchart TD
  A[User Opens Task] --> B[Writes Comment]
  B --> C[Create TaskComment]
  C --> D[Link Comment To Task]
  C --> E[Link Comment To User]
  D --> F[Show Comment In Task Timeline]
```

## Notification Flow

```mermaid
flowchart TD
  A[Task Event Happens] --> B{Event Type}
  B --> C[Task Assigned]
  B --> D[Status Changed]
  B --> E[Comment Added]
  C --> F[Create Notification]
  D --> F
  E --> F
  F --> G[Notification isRead = false]
  G --> H[User Reads Notification]
  H --> I[Set isRead = true]
```

## Seed Data Flow

```mermaid
flowchart TD
  A[Run npx prisma db seed] --> B[Create Default Roles]
  B --> C[Admin]
  B --> D[Manager]
  B --> E[Team Lead]
  B --> F[Employee]
  B --> G[HR]
  B --> H[Sales]
  A --> I[Create Default Task Workflow]
  I --> J[Open]
  J --> K[Assigned]
  K --> L[In Progress]
  L --> M[Review]
  M --> N[Done]
```

## Current Default Connection Values

```text
Backend DATABASE_URL:
postgresql://spms_user:spms_password@localhost:5432/spms_ibmp?schema=public

pgAdmin PostgreSQL connection:
Host: postgres
Port: 5432
Database: spms_ibmp
Username: spms_user
Password: spms_password
```
