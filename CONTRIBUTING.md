# Contributing to Global Weather View

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- npm

### Quick Start


1. **Fork the repository**
   - Click the "Fork" button on the repository page

2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd global-weather-view
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:9002`

## Available Commands

- `npm install` - Install all dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check code quality
- `npm run typecheck` - Check TypeScript types

## Making Changes

1. Create a new branch for your feature
2. Make your changes
3. Test locally with `npm run dev`
4. Submit a pull request

## Project Structure

- `src/app/` - Next.js pages
- `src/components/` - React components
- `src/lib/` - Utilities and data (including `cities.json`)
- `src/types/` - TypeScript definitions

That's it! You're ready to contribute. 🌤️
