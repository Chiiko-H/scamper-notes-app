# SCAMPER Notes App

## Overview

This is a full-stack web application that implements a note-taking system specifically designed around the SCAMPER creative thinking methodology. SCAMPER is a brainstorming technique that uses seven prompts (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse) to help users think creatively about problems and generate new ideas.

The application allows users to create notes and then develop them using the SCAMPER framework, providing a structured approach to creative thinking and idea development.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and Material Design influences
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: TSX for TypeScript execution in development

### Data Storage
- **Primary Database**: PostgreSQL
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Strategy**: Drizzle Kit for database migrations
- **Fallback Storage**: In-memory storage implementation for development/testing

## Key Components

### Database Schema
The application uses two main tables:

1. **Notes Table** (`notes`)
   - `id`: Primary key (serial)
   - `title`: Note title (text, required)
   - `content`: Note content (text, defaults to empty)
   - `created_at`: Timestamp (auto-generated)

2. **SCAMPER Data Table** (`scamper_data`)
   - `id`: Primary key (serial)
   - `note_id`: Foreign key to notes table
   - Seven SCAMPER fields: `substitute`, `combine`, `adapt`, `modify`, `put_to_other_use`, `eliminate`, `reverse`
   - All SCAMPER fields default to empty strings

### API Endpoints
- `GET /api/notes` - Retrieve all notes with SCAMPER progress
- `GET /api/notes/:id` - Retrieve single note with SCAMPER data
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note title/content
- `DELETE /api/notes/:id` - Delete note and associated SCAMPER data
- `POST /api/notes/:id/scamper` - Create or update SCAMPER data
- `GET /api/notes/:id/scamper` - Retrieve SCAMPER data for specific note

### Frontend Pages
1. **Note List** (`/`) - Grid view of all notes with creation date and SCAMPER progress
2. **Note Detail** (`/notes/:id`) - Edit note title and content with navigation to SCAMPER editor
3. **SCAMPER Editor** (`/notes/:id/scamper`) - Structured form for all seven SCAMPER prompts with progress tracking

### UI Design Philosophy
- Material Design inspired with custom color palette
- Mobile-first responsive design
- Japanese language support in UI text
- Clean, minimal interface focusing on content creation
- Progress indicators for SCAMPER completion

## Data Flow

1. **Note Creation**: User creates a new note from the main list, automatically redirected to edit mode
2. **Note Editing**: Users can modify title and content with auto-save functionality
3. **SCAMPER Development**: Users access the SCAMPER editor from note detail to work through creative prompts
4. **Progress Tracking**: System calculates completion percentage based on filled SCAMPER fields
5. **Data Persistence**: All changes are automatically saved to PostgreSQL database

## External Dependencies

### Frontend Dependencies
- **Core**: React, TypeScript, Vite
- **UI**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **State**: TanStack Query for server state management
- **Forms**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **Utilities**: clsx, class-variance-authority for conditional styling

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: esbuild for production server bundling
- **Types**: Node.js types, Vite client types
- **Configuration**: PostCSS, Autoprefixer for CSS processing

## Deployment Strategy

### Development Environment
- Uses tsx for running TypeScript directly
- Vite dev server for frontend with HMR
- PostgreSQL database (local or Neon)
- Port 5000 for backend API

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server to `dist/index.js`
- Static file serving from built frontend
- Environment variables for database connection

### Replit Configuration
- Supports autoscale deployment target
- PostgreSQL 16 module enabled
- Configures proper port forwarding (5000 → 80)
- Parallel workflow execution for development

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```