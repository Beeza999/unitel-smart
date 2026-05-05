# วิธีรันบน Windows PowerShell

## Backend

```powershell
cd backend
npm install
copy .env.example .env
notepad .env
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

## Frontend

เปิด PowerShell อีกหน้าต่าง:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

ถ้าเจอ error Prisma ให้เช็กก่อนว่าไฟล์นี้มีจริง:

```powershell
Test-Path .\prisma\seed.js
Test-Path .\src\routes\catalogRoutes.js
```

ต้องขึ้น `True` ทั้งสองอัน
