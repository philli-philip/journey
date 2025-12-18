# Project Overview

## Goal

The goal of this software development project is to create an open source tool to manage user journeys for enterprise customer. The tool will provide a user interface to create, edit, and visualize user journeys. The tool will also provide a backend to store and manage the user journeys. Users should be able to create additional dimensions like technical dependencies, teams working on that journey step.

## Scope

### MVP

The minimum viable product (MVP) for this project will include the following features:

- User interface to create, edit, and visualize user journeys
- Backend to store and manage user journeys
- A set of defined dimensions:
  - User journey steps
  - Description of the step
  - Technical dependencies

### Future Enhancements

In the future, we plan to add the following features to the tool:

- Website to market the tool and provide documentation
- User authentication and authorization
- Team management
- More dimensions like teams working on that journey step, nested journeys, links to other journeys, etc.

## Technical Stack

- Website: React, typescript, tailwindcss, should be static rendered
- Frontend: React, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Fastify, TypeScript, Vite
- Database: SQLite
- Hosting: Self-hosted on a server

# Folder structure

## Frontend application

For the front-end, the folder structure will follow the standard React project structure. The main folders will be:

- `frontend`: Contains the source code for the front-end application.
  - `components`: Contains reusable React components.
  - `pages`: Contains the different pages of the application.
  - `styles`: Contains the CSS styles for the application.
  - `utils`: Contains utility functions and helpers.
- `public`: Contains static assets like images and the `index.html` file.

## Backend

For the back-end, the folder structure will be as follows:

- `server`: Contains the source code for the back-end application.
  - `controllers`: Contains the route handlers for the application.
  - `models`: Contains the database models and schemas.
  - `utils`: Contains utility functions and helpers.
- `public`: Contains static assets like images and the `index.html` file.

## Website

For the website, the folder structure will follow the standard React project structure. The main folders will be:

- `www`: Contains the source code for the website.
  - `components`: Contains reusable React components.
  - `pages`: Contains the different pages of the website.
  - `styles`: Contains the CSS styles for the website.
  - `utils`: Contains utility functions and helpers.
- `public`: Contains static assets like images and the `index.html` file.
