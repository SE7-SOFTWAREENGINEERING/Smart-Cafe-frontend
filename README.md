# Smart Cafe Frontend

React (TypeScript) frontend for the Smart Cafe application, built with Vite and TailwindCSS.

## Feature Overview & CI/CD Status
This repository has been recently upgraded to support a robust, automated DevOps lifecycle:

- ✅ **Continuous Integration (GitHub Actions)**: Automated pipeline triggers on every push/PR to run linting, unit tests, and production builds.
- ✅ **Optimized Containerization (Docker)**: Includes a multi-stage `Dockerfile` utilizing an Nginx server for production-ready, lightweight application serving.
- ✅ **Test Infrastructure (`vitest` & `happy-dom`)**: Fast, resilient ESM-compatible unit testing environment mirroring the DOM. Ensure reliable API mocking via isolated `vi.mock` configurations.
- ✅ **Clean Codebase**: Fully standardized UTF-8 configuration files (such as `.gitignore`), guaranteeing no ghost-tracked `node_modules`.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Testing**: Vitest, React Testing Library, Happy-DOM
- **Routing**: React Router DOM
- **Network Requests**: Axios (with centralized `api.config.ts`)
- **Containerization**: Docker, Nginx

## Quick Start (Local Development)
```bash
# 1. Install Dependencies
npm install

# 2. Run the Development Server
npm run dev

# 3. Run the Unit Tests
npm run test
```

## Running with Docker (Production Mode)
To run the full frontend stack locally exactly as it would appear in production:
```bash
# From the root of the project (where docker-compose.yml lives)
docker-compose up --build -d
```
The application will be served at `http://localhost:80`.

## Project Structure Highlights
- `/src/services`: Contains the `api.config.ts` network interceptors and all endpoint connectors (auth, booking, forecast, etc.).
- `/src/services/__tests__`: Comprehensive Vitest test suites.
- `/.github/workflows/ci-cd.yml`: The GitHub Actions CI pipeline configuration.
