# gps-tracking-system

## Overview
This project is a GPS tracking system that consists of two main components:
- **Frontend**: Located in the `/admin` directory, built with React and Material-UI.
- **Backend**: Located in the `/server` directory, built with Node.js and Express.

## Technologies Used
- **Frontend**:
  - React
  - Material-UI
  - Redux
  - Axios
  - React Router
  - And more (see `admin/package.json` for details).

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT for authentication
  - Winston for logging
  - And more (see `server/package.json` for details).

## Setup Instructions

### Using Docker Compose
1. Ensure you have Docker and Docker Compose installed on your system.
2. In the root directory of the project, run the following command to start the services:
   ```bash
   docker-compose up
   ```
   This will start the MongoDB database and the backend server.

### Frontend Setup
1. Navigate to the `/admin` directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the `/server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Additional Information
- The frontend is accessible at `http://localhost:3000`.
- The backend server runs on `http://localhost:3009` (as configured in Docker Compose).

## Author
John Cyruss Morales