# Slooze Assignment - Restaurant Management System

This is a restaurant management dashboard built with Next.js, Drizzle ORM, and Better-Auth.

## Setup & Delivery Instructions

Follow these steps to set up the project locally and verify the functionality.

### 1. Environment Configuration

Copy the example environment file to `.env` and fill in your secrets:

```bash
cp .env.example .env
```

Open `.env` and add your configuration:

```env
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Database Setup

Ensure your PostgreSQL database is running. You can use the provided Docker Compose file to start a local instance:

```bash
# Start the PostgreSQL server
docker compose up -d
```

Once the database is running, push the schema and seed the initial data:

```bash
# Push the schema to the database
npm run db:push

# Seed the database with default users and restaurants
npm run db:seed
```

### 3. Database Viewer (Drizzle Studio)

You can explore the database locally using Drizzle Studio:

1. Run the studio command:
   ```bash
   npx drizzle-kit studio
   ```
2. Open [https://local.drizzle.studio](https://local.drizzle.studio) in your browser to view and manage your data.

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials for Reviewers

Use the following credentials to test different role-based permissions:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `nick@example.com` | `password123` | Full access, User Management, Payment Methods |
| **Manager** | `manager@example.com` | `password123` | Order Management (Cancel/Complete), Checkout |
| **Member** | `member@example.com` | `password123` | View Menu, Add to Cart (No Checkout) |

## Key Features

- **Role-Based Access Control (RBAC)**: Different UI and permissions for Admin, Manager, and Member.
- **Global Location Selector**: Switch between India and America branches (Admin only).
- **User Management**: Admin can create, edit, and delete users.
- **Order Tracking**: Real-time status updates and filtering.
- **Optimized UI**: Skeleton loaders and component-level spinners to prevent flickering.
