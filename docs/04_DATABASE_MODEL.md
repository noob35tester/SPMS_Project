# 04. MVP Database Model

## MVP Database Groups

### Identity Group

- users
- roles
- departments

### Project Group

- projects
- project_members
- tasks
- task_comments
- task_attachments

### Workflow Group

- workflow_definitions
- workflow_states
- workflow_transitions
- workflow_history

### CRM Group

- clients
- leads

### HRMS Group

- employees

### Notification Group

- notifications

## Table Purpose

| Table | Purpose |
|---|---|
| users | Login and user profile |
| roles | Role master |
| departments | Company departments |
| projects | Project master |
| project_members | Users attached to projects |
| tasks | Task records |
| task_comments | Task discussions |
| task_attachments | Uploaded files |
| workflow_definitions | Workflow master |
| workflow_states | Statuses under workflow |
| workflow_transitions | Allowed status movement |
| workflow_history | Status movement log |
| clients | Client records |
| leads | CRM leads |
| employees | HRMS employee records |
| notifications | User alerts |

## Important Relationship

Task status should refer to `workflow_states`.

Task movement should be validated through `workflow_transitions`.

Workflow movement should be logged in `workflow_history`.
