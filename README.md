## Getting Started

To get started with the project, follow these steps:

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd journey
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   This will include some postinstalls to also install the server and frontend dependencies.

### Running the Development Server

To run the development server:

```bash
npm run dev
```

This will start the Vite development server, and you can access the application in your browser at the provided local address (usually `http://localhost:3000`).

At the same time the server will start at `http://localhost:3001`.

### Seed Script

If you want to populate your local database with some initial data, you can use the seed script. It directly interacts with the database to insert predefined data.

```bash
npm run seed
```
