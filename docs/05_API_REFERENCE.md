# 05. MVP API Reference

Base URL:

```text
/api
```

## Auth APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh token later |
| GET | /auth/me | Current user profile |

## User and Department APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /users | List users |
| POST | /users | Create user |
| GET | /departments | List departments |
| POST | /departments | Create department |

## Project APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /projects | List projects |
| POST | /projects | Create project |
| GET | /projects/:id | Project details |
| POST | /projects/:id/members | Add project member |

## Task APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /tasks | List tasks |
| POST | /tasks | Create task |
| GET | /tasks/:id | Task details |
| PATCH | /tasks/:id/status | Change task status |
| POST | /tasks/:id/comments | Add comment |
| POST | /tasks/:id/attachments | Upload attachment |

## Workflow APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /workflows | List workflows |
| POST | /workflows | Create workflow |
| POST | /workflows/:id/states | Create status |
| POST | /workflows/:id/transitions | Create allowed transition |
| GET | /workflows/:id/history | Workflow history |

## CRM APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /crm/leads | List leads |
| POST | /crm/leads | Create lead |
| PATCH | /crm/leads/:id/stage | Update lead stage |

## HRMS APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /hrms/employees | List employees |
| POST | /hrms/employees | Create employee record |
| GET | /hrms/employees/:id | Employee details |

## Notification APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /notifications | List my notifications |
| PATCH | /notifications/:id/read | Mark as read |

## Dashboard APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /dashboard/summary | Basic dashboard summary |
