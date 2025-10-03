# Fullstack App

A deploy-ready fullstack application with Node.js backend, React frontend, and a compiler service, all containerized using Docker.

## Services

- **Backend**: Node.js + Express API server (port 8000)
- **Frontend**: React application served via nginx (port 80)
- **Compiler**: Node.js service (port 3001)

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Navigate to the project directory:
   ```bash
   cd fullstack-app
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - Compiler Service: http://localhost:3001

### Development

To run services individually:

- Backend: `cd backend && npm install && npm start`
- Frontend: `cd frontend && npm install && npm run dev`
- Compiler: `cd compiler && npm install && npm start`

## Structure

```
fullstack-app/
├── backend/          # Node.js Express API
├── frontend/         # React application
├── compiler/         # Compiler service
├── docker-compose.yml
└── README.md
