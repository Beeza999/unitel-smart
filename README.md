# Unitel Smart Connect - Ready Project

โปรเจกต์นี้ทำให้โหลดไปแล้วแก้แค่ `.env` แล้วรันได้เลย

## Stack
- Frontend: React JS + Tailwind CSS + JavaScript
- Backend: Node.js + Express
- Database: MongoDB Atlas
- ORM: Prisma v6
- Auth: JWT

## 1) Backend

```bash
cd backend
npm install
copy .env.example .env
```

แก้ `backend/.env` ใส่ MongoDB Atlas URL จริง:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/unitel_smart_connect?retryWrites=true&w=majority"
JWT_SECRET="your_secret"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

จากนั้นรัน:

```bash
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

## 2) Frontend

เปิด terminal ใหม่:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Demo Login

Admin:
02000000000
MyAdmin@2026_StrongPassword

User:
02055551234
UserDemo@2026

## Pages

User:
- `/`
- `/shop`
- `/packages`
- `/ai-finder`
- `/esim`
- `/cart`
- `/checkout`
- `/account`
- `/account/orders`

Admin:
- `/admin`
- `/admin/sims`
- `/admin/packages`
- `/admin/orders`
- `/admin/customers`
- `/admin/promotions`
- `/admin/reports`


vercel
render