# 03. Technical Flow: Task Status Change

## Business Scenario

User moves a task from `In Progress` to `Review` on the Kanban board.

## Correct Technical Flow

```text
User moves task from In Progress to Review
 ↓
Frontend sends PATCH /tasks/:id/status
 ↓
Backend verifies JWT token
 ↓
Backend checks role permission
 ↓
Workflow Engine checks allowed transition
 ↓
Database updates task status
 ↓
Workflow history is saved
 ↓
Notification is created for reviewer
 ↓
Dashboard and Kanban refresh
```

## Why This Is Correct

The Task module should not decide which status movement is allowed.

The Workflow Engine should decide this.

This keeps the platform flexible because the same Workflow Engine can later be used for:

- Task workflow
- Leave workflow
- Lead workflow
- Content approval workflow
- Employee onboarding workflow

## Backend Responsibility Split

| Layer | Responsibility |
|---|---|
| Controller | Receives API request |
| Auth Guard | Checks logged-in user |
| Roles Guard | Checks role permission |
| Task Service | Handles task operation |
| Workflow Service | Validates status transition |
| Prisma Service | Writes to database |
| Notification Service | Creates notification |

## Example Request

```http
PATCH /api/tasks/task_123/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "toStatusId": "status_review",
  "comment": "Work completed. Please review."
}
```

## Example Response

```json
{
  "id": "task_123",
  "title": "Create module storyboard",
  "statusId": "status_review",
  "message": "Task moved to Review successfully"
}
```
