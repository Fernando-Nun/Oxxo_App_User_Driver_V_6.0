# OXXO Uber-like Mobile App

## Overview
This is a React + Vite + TypeScript application for OXXO Viajes (OXXO Travel), an Uber-like mobile app experience. The application features a splash screen, login system, and three different user dashboards (Admin, User, and Driver).

## Tech Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1
- **UI Components**: Radix UI components with shadcn/ui
- **Package Manager**: npm

## Project Structure
- `/src` - Source code
  - `/components` - React components
    - `/ui` - Reusable UI components (shadcn/ui)
    - `/figma` - Figma-specific components
    - Dashboard components for different user roles
  - `/assets` - Images and static assets
  - `/styles` - Global CSS styles
  - `/guidelines` - Project guidelines
- `/index.html` - HTML entry point
- `/vite.config.ts` - Vite configuration
- `/tsconfig.json` - TypeScript configuration

## Development Setup
The project is configured to run in the Replit environment:
- **Dev Server**: Runs on `0.0.0.0:5000` for Replit compatibility
- **Workflow**: "Start application" runs `npm run dev`
- **Hot Reload**: Vite provides instant hot module replacement

## Configuration Details
### Vite Config
- Host: `0.0.0.0` (required for Replit iframe proxy)
- Port: `5000` (required for Replit webview)
- Build output: `build/` directory
- Module aliases configured for all dependencies

### TypeScript
- JSX: `react-jsx` (new JSX transform, no React import needed)
- Target: ES2020
- Module: ESNext with bundler resolution

## Running the Application
The development server is already running via the "Start application" workflow. The app shows:
1. Splash screen (5 seconds)
2. Login screen with role selection (Admin, User, Driver)
3. Role-specific dashboard after login

## Deployment
Deployment is configured for static hosting:
- Build command: `npm run build`
- Output directory: `build/`
- Deployment type: Static site

## Recent Changes (December 2, 2025)
- Imported from GitHub repository
- Created TypeScript configuration files (`tsconfig.json`, `tsconfig.node.json`)
- Updated Vite config for Replit environment (port 5000, host 0.0.0.0)
- Fixed node_modules binary permissions
- Installed required dependencies (typescript, tailwindcss, postcss, autoprefixer)
- Configured deployment settings for static build
- Created .gitignore for Node.js project
- Verified application runs successfully

## User Roles
The application supports three user types:
- **Admin**: Administrative dashboard
- **User**: Customer/rider dashboard
- **Driver**: Driver dashboard

## Notes
- The app uses Tailwind CSS v4.1 with custom design tokens
- UI components are based on Radix UI primitives
- The project was originally designed in Figma
