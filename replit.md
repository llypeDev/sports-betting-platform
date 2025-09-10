# Sports Betting Management Platform

## Overview

BetTracker is a professional sports betting management platform designed for serious sports bettors who need comprehensive tools to track their bankroll, analyze performance, and optimize their betting strategies. The application provides detailed bet logging, bankroll management, performance analytics, and data visualization capabilities through a clean, productivity-focused interface.

The platform serves as a centralized hub where users can register detailed bet information, manage multiple bankrolls, track deposits and withdrawals, and gain insights into their betting performance through various metrics and charts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built as a Single Page Application (SPA) using React with TypeScript, providing a responsive and interactive user experience. The architecture follows these key decisions:

- **React + TypeScript**: Chosen for type safety and modern development experience
- **Wouter**: Lightweight client-side routing library instead of React Router for minimal bundle size
- **TanStack Query**: Handles server state management, caching, and data synchronization
- **Tailwind CSS + shadcn/ui**: Utility-first styling with a comprehensive component library for consistent UI
- **Vite**: Fast build tool and development server for optimal developer experience

The design system follows Material Design principles with productivity app influences, emphasizing clean, functional design that prioritizes usability over visual flair. The color palette uses professional blues for trust and reliability, with semantic colors for wins/losses/pending states.

### Backend Architecture
The server-side implements a RESTful API using Express.js with TypeScript, following these architectural patterns:

- **Express.js**: Lightweight web framework for API endpoints
- **Repository Pattern**: Database operations are abstracted through a storage interface
- **Session-based Authentication**: Uses Replit Auth with PostgreSQL session storage
- **Middleware-based Request Processing**: Structured request handling with logging and error management

API endpoints are organized around core entities (bets, transactions, users) with proper error handling and validation using Zod schemas.

### Database Design
PostgreSQL database with Drizzle ORM provides type-safe database operations:

- **Users Table**: Stores user profiles with Replit Auth integration
- **Bets Table**: Comprehensive bet tracking with sport, league, market, selection, odds, stake, and outcome data
- **Transactions Table**: Bankroll management with deposits/withdrawals
- **Sessions Table**: Required for Replit Auth session management

The schema uses decimal types for financial data to ensure precision, and includes proper foreign key relationships and indexing.

### Authentication & Authorization
Implements Replit-based OAuth authentication:

- **OpenID Connect**: Uses Replit's OIDC provider for secure authentication
- **Session Management**: PostgreSQL-backed sessions with configurable TTL
- **Route Protection**: Middleware-based authentication checks for protected endpoints
- **User Management**: Automatic user creation/updates from OAuth claims

### State Management
Client-side state is managed through multiple layers:

- **TanStack Query**: Handles server state, caching, and API synchronization
- **React Context**: Theme management and component-level state
- **Local Component State**: Form handling and UI interactions
- **Session Storage**: Minimal use for theme preferences

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting service for production database
- **Replit Auth**: OAuth authentication service integration
- **Replit Hosting**: Primary deployment platform

### UI Components & Styling
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library built on Radix
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter and JetBrains Mono fonts

### Data & Charts
- **Recharts**: Chart visualization library for analytics dashboard
- **date-fns**: Date manipulation and formatting utilities
- **React Hook Form**: Form state management and validation

### Development Tools
- **Drizzle ORM**: Type-safe database ORM and migration tool
- **Zod**: Schema validation for API requests and responses
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire stack

The application is designed to be self-contained with minimal external service dependencies, relying primarily on Replit's infrastructure for hosting and authentication, with Neon for managed PostgreSQL hosting.