# Portfolio Website

A full-stack portfolio website built with Next.js 16, React 19, TypeScript, Prisma, and MongoDB. Features a public portfolio showcase and an admin dashboard for content management.

## Features

### Public Features
- View Profile (name, bio, avatar, social links)
- View Skills with proficiency levels
- View Tech Stack & Tools organized by category
- Browse Projects showcase
- SEO optimized pages

### Admin Features
- Secure admin login with JWT authentication
- Protected admin routes
- CRUD operations for:
  - Profile
  - Skills
  - Tech Stack & Tools
  - Projects

## Tech Stack

- **Frontend & Backend**: Next.js 16.1.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with HttpOnly cookies
- **Security**: Server-side auth validation, Zod validation on all inputs

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd port
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# For local MongoDB:
DATABASE_URL="mongodb://localhost:27017/portfolio"
# Or for MongoDB Atlas (cloud):
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── login/         # Admin login page
│   │   ├── profile/       # Profile management
│   │   ├── skills/        # Skills management
│   │   ├── tech-stack/    # Tech stack management
│   │   └── projects/      # Projects management
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── profile/       # Profile API
│   │   ├── skills/        # Skills API
│   │   ├── tech-stack/    # Tech stack API
│   │   └── projects/      # Projects API
│   ├── projects/          # Public projects page
│   ├── skills/            # Public skills page
│   ├── tech-stack/        # Public tech stack page
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
└── middleware.ts          # Route protection middleware
```

## Admin Access

After seeding the database, you can log in to the admin dashboard at `/admin/login` using the credentials from your `.env` file:
- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin

### Profile
- `GET /api/profile` - Get profile (public)
- `POST /api/profile` - Create/Update profile (admin only)

### Skills
- `GET /api/skills` - Get all skills (public)
- `POST /api/skills` - Create skill (admin only)
- `PUT /api/skills/[id]` - Update skill (admin only)
- `DELETE /api/skills/[id]` - Delete skill (admin only)

### Tech Stack
- `GET /api/tech-stack` - Get all tech stack items (public)
- `POST /api/tech-stack` - Create tech stack item (admin only)
- `PUT /api/tech-stack/[id]` - Update tech stack item (admin only)
- `DELETE /api/tech-stack/[id]` - Delete tech stack item (admin only)

### Projects
- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (admin only)

## Security Features

- JWT authentication stored in HttpOnly cookies
- Server-side route protection via middleware
- Zod validation on all API inputs
- Password hashing with bcrypt
- Protected admin routes
- No public registration

## Deployment

1. Set up your production database
2. Update environment variables
3. Run database migrations:
```bash
npx prisma db push
npx prisma generate
npm run db:seed
```
4. Build the application:
```bash
npm run build
```
5. Start the production server:
```bash
npm start
```

## License

MIT
