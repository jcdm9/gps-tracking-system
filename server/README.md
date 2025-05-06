# RilQuick Server

A Node.js backend server application built with Express.js and MongoDB.

## Features

- RESTful API architecture
- MongoDB database integration
- JWT authentication
- Secure password hashing with bcrypt
- Request logging with Winston
- CORS enabled
- Helmet security headers
- Excel file processing capabilities
- Docker support

## Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jcdm9/server.git
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_URL=mongodb://localhost:27017/rilquick
JWT_SECRET=your_jwt_secret
PORT=3009
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on port 3009 by default.

## Database Seeding

To seed the database with initial data:

For local development:
```bash
npm run seed_local
```

For production:
```bash
npm run seed
```

## Docker Deployment

Build and run the Docker container:
```bash
docker build -t rilquick-server .
docker run -p 3009:3009 rilquick-server
```

## API Documentation

The API endpoints are available at:
- Base URL: `http://localhost:3009`

## Dependencies

### Main Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- helmet: Security headers
- winston: Logging
- xlsx: Excel file processing

### Development Dependencies
- nodemon: Development server with auto-reload
- morgan: HTTP request logger

## Author

John Cyruss Morales