# Federated Shell Application

This federated shell application demonstrates micro frontend architecture using Module Federation. It combines both React and Angular implementations of the advanced data table component into a single, unified experience.

## Architecture

### Components
- **Shell Application (Port 3000)**: Main federated host that orchestrates the micro frontends
- **React App (Port 5000)**: React implementation exposed as a remote module
- **Angular App (Port 4201)**: Angular implementation exposed as a remote module

### Technology Stack
- **Module Federation**: Webpack Module Federation for runtime composition
- **React 19**: Modern React with hooks for the shell application
- **Vite**: Fast build tool and dev server for React components
- **TailwindCSS**: Utility-first CSS framework for consistent styling
- **React Router**: Client-side routing for navigation between micro frontends

## Getting Started

### Prerequisites
Make sure all dependencies are installed:

```bash
# Install main React app dependencies
cd ../ && npm install

# Install Angular app dependencies
cd ../angular && npm install

# Install federated shell dependencies
npm install
```

### Development Mode

To run in development mode, you need to start all three applications in separate terminals:

```bash
# Terminal 1: Start React app (Remote)
cd ../ && npm run dev

# Terminal 2: Start Angular app (Remote) 
cd ../angular && npm start

# Terminal 3: Start Federated Shell (Host)
npm run dev
```

Then open http://localhost:3000 to view the federated application.

### Production Build

```bash
# Build all applications
npm run build:all
```

## Features

- **Runtime Integration**: Micro frontends are loaded at runtime, not build time
- **Independent Development**: Each application can be developed and deployed independently
- **Shared Dependencies**: Common libraries (React, React-DOM) are shared for efficiency
- **Consistent Navigation**: Unified navigation between different micro frontend implementations
- **Framework Agnostic**: Demonstrates integration between React and Angular applications

## Navigation

- **Home**: Overview and architecture information
- **React App**: React implementation of the advanced data table
- **Angular App**: Angular implementation of the advanced data table

## Development Notes

- The React app is exposed as `reactApp/App` remote module
- The Angular app is embedded via iframe for simplicity (in production, you'd use proper Angular elements or better integration)
- Shared dependencies are configured to avoid duplication
- Each application maintains its own build process and can be deployed independently