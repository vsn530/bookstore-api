# MongoDB Books API

A Node.js Express API for managing a books collection using MongoDB.

## Features
- Get books with filtering (rating >= 4.4)
- Pagination support
- MongoDB Atlas integration

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your MongoDB connection string to `.env`

## Running the Application

```bash
node app.js
```

The API will start on `http://localhost:3000`

## API Endpoints

- `GET /books` - Get books with pagination
  - Query params: `page` (default: 0)

## Dependencies
- express: ^5.2.1
- mongodb: ^7.1.1
