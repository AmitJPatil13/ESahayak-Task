# ESahayak Buyer Lead Intake

A full-stack application for capturing, managing, and processing buyer leads with advanced filtering, search, and CSV import/export capabilities.

## Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod (client & server)
- **Authentication**: Demo login + Magic link placeholder

## Project Structure

```
/
├── frontend/           # Next.js App Router + TypeScript + Tailwind
│   ├── app/           # Next.js routes
│   ├── components/    # React components
│   ├── lib/          # Zod schemas, API client, mocks
│   ├── styles/       # Global styles
│   └── package.json
├── backend/           # Node + TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/    # Prisma client wrapper
│   │   ├── validators/ # Zod schemas
│   │   ├── routes/
│   │   └── app.ts
│   ├── prisma/       # Database schema & migrations
│   └── package.json
├── .github/
│   └── workflows/    # CI/CD configuration
└── README.md
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DATABASE
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=development
PORT=4000
```

### Installation & Setup

1. **Clone and setup repository**
   ```bash
   git clone https://github.com/AmitJPatil13/ESahayak-Task.git
   cd ESahayak-Task
   ```

2. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   npm run migrate
   npm run seed
   npm run dev
   ```

## Features

### Core Functionality
- ✅ Create, read, update, delete buyer leads
- ✅ Server-side pagination with filtering and search
- ✅ CSV import/export (max 200 rows)
- ✅ Real-time validation with Zod
- ✅ Ownership-based access control
- ✅ Concurrency handling with optimistic locking

### Data Model
- **Buyers**: Full lead information with validation
- **Users**: Authentication and ownership
- **Buyer History**: Audit trail for all changes

### Security & Quality
- Rate limiting on create/update operations
- Input validation on both client and server
- Prepared statements via Prisma
- Error boundaries and accessibility features

## API Endpoints

- `POST /auth/demo-login` - Demo authentication
- `GET /buyers` - List buyers with pagination/filters
- `POST /buyers` - Create new buyer
- `GET /buyers/:id` - Get single buyer
- `PUT /buyers/:id` - Update buyer
- `DELETE /buyers/:id` - Delete buyer
- `POST /buyers/import` - CSV import
- `GET /buyers/export` - CSV export

## Development Commands

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

### Backend
```bash
npm run dev     # Start development server
npm run migrate # Run database migrations
npm run seed    # Seed database with test data
npm run test    # Run unit tests
```

## Implementation Status

- [x] Project setup and repository structure
- [ ] Frontend scaffold with Next.js and Tailwind
- [ ] Zod validation schemas
- [ ] Frontend UI with mock data
- [ ] Backend API with Express and Prisma
- [ ] Database schema and migrations
- [ ] CSV import/export functionality
- [ ] Frontend-backend integration
- [ ] Vercel deployment setup
- [ ] Unit tests and CI/CD

## Design Decisions

### Validation Strategy
- Zod schemas shared between frontend and backend
- Client-side validation for UX, server-side for security
- Custom refinements for business logic (e.g., BHK requirements)

### SSR vs Client Responsibilities
- Server-side rendering for SEO and initial page load
- Client-side interactions for dynamic filtering and search
- URL synchronization for shareable filtered states

### Ownership Enforcement
- JWT-based authentication with user context
- Database-level ownership checks on mutations
- UI-level permission controls (hide edit/delete for non-owners)

### Concurrency Handling
- Optimistic locking using `updatedAt` timestamps
- 409 Conflict responses for stale updates
- User-friendly error messages with refresh prompts

## License

MIT License - see LICENSE file for details
