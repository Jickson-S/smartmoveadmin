# SmartMove Admin Panel

React-based admin console for managing SmartMove operations: analytics, cars, bookings, and users.

## Setup

```bash
npm install
```

## Run Dev Server

```bash
npm run dev -- --port 5174
```

## Environment Variables

Create `.env` in `smartmove-admin`:

```env
VITE_API_URL=http://localhost:8000/api
```

- `VITE_API_URL`: Backend API base path for admin endpoints.

## Routes / Pages

- `/login` → Admin login
- `/dashboard` → KPI cards + analytics charts + recent bookings
- `/cars` → Add/edit/delete cars with image upload
- `/bookings` → View all bookings and update status
- `/users` → Search users and toggle active/inactive state

## Chart.js Charts Used

- Line chart: monthly revenue trend
- Doughnut chart: fleet utilization (available vs booked)
- Bar chart: bookings by car type

## Admin Auth vs User Auth

- Both use backend `/api/auth/login` endpoint.
- Admin panel explicitly verifies `user.role === 'admin'` after login.
- Admin token is stored separately as `adminToken` (and user as `adminUser`) in localStorage.
- Non-admin users are blocked from admin routes even if login succeeds in backend response.

## Creating the First Admin User

### Option 1: Seed Script

Run backend seed:

```bash
cd ../smartmove-backend
node seed.js
```

This creates:
- `admin@smartmove.com`
- Password: `admin123`

### Option 2: MongoDB Compass

1. Open `smartmove` database in Compass.
2. Insert into `users` collection:

```json
{
  "name": "Admin User",
  "email": "admin@smartmove.com",
  "password": "<bcrypt-hash>",
  "role": "admin",
  "isActive": true
}
```

Use any bcrypt tool to generate the password hash.
# smartmoveadmin
