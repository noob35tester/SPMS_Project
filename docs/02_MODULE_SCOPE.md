# 02. MVP Module Scope

## 1. Authentication and Access

### Include

- Login
- JWT authentication
- Role-based access control
- Users
- Roles
- Departments

### Avoid Initially

- SSO
- OAuth
- MFA
- Complex permission UI

## 2. Project and Task Management

### Include

- Project creation
- Project members
- Task creation
- Task assignment
- Task priority
- Due date
- Task status tracking
- Kanban board
- Comments
- Attachments

### Avoid Initially

- Gantt charts
- Sprint planning
- Time tracking
- Cost tracking
- Complex dependencies

## 3. Workflow Engine

### Include

- Workflow definitions
- Status definitions
- Allowed transitions
- Role-based transition control
- Workflow history

### MVP Task Workflow

```text
To Do -> In Progress -> Review -> Done
Review -> In Progress
```

## 4. CRM Module

### Include

- Lead records
- Client records
- Lead stage
- Basic follow-up notes

### Avoid Initially

- Proposal builder
- Deal forecasting
- WhatsApp automation
- Complex pipeline analytics

## 5. HRMS Module

### Include

- Employee records
- Department mapping
- Reporting manager
- Joining date
- Basic leave information field

### Avoid Initially

- Payroll
- Attendance device integration
- Recruitment
- Complex leave policy engine

## 6. Notifications and Reports

### Include

- In-app notifications
- Basic email notification ready structure
- Dashboard counts
- Pending task summary

### Avoid Initially

- Advanced analytics
- AI task summary
- Auto-generated reports
