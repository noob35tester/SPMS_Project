# 06. Development File Structure

## Recommended Structure

```text
technoedge_mvp_architecture_v1/
├── README.md
├── docker-compose.yml
├── docs/
│   ├── 01_MVP_SYSTEM_ARCHITECTURE.md
│   ├── 02_MODULE_SCOPE.md
│   ├── 03_TECHNICAL_FLOW_TASK_STATUS_CHANGE.md
│   ├── 04_DATABASE_MODEL.md
│   ├── 05_API_REFERENCE.md
│   ├── 06_DEV_FILE_STRUCTURE.md
│   └── mvp_architecture.mmd
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── common/
│       ├── config/
│       └── modules/
│           ├── auth/
│           ├── users/
│           ├── departments/
│           ├── projects/
│           ├── tasks/
│           ├── workflow/
│           ├── crm/
│           ├── hrms/
│           ├── notifications/
│           └── dashboard/
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        ├── context/
        ├── layouts/
        ├── routes/
        └── pages/
```

## Why This Structure Works

| Area | Benefit |
|---|---|
| docs | Development team gets clear architecture |
| backend/modules | Each business module remains separate |
| backend/common | Shared guards, decorators, helpers |
| prisma | Database schema remains version-controlled |
| frontend/pages | Screens are easy to build and maintain |
| frontend/api | API calls remain centralised |
