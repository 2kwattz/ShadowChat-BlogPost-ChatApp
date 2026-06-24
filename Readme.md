# ShadowChat - Project Summary

ShadowChat is a full-stack social and community chat application built with a React frontend and an Express/MySQL backend. The project combines user authentication, community discovery, chatroom foundations, profile/device tracking, security middleware, and early AI integration through a local Ollama model.

The app is currently structured as a Reddit-inspired platform where users can sign up, log in, browse communities, access protected pages, view their profile/device data, and interact with backend APIs for communities, chatrooms, authentication, GraphQL, Swagger docs, and AI prompts.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express 5, Socket.IO
- Database: MySQL using `mysql2`
- Cache/session support: Redis with `ioredis`
- Authentication: JWT, bcrypt, cookie-based token storage
- API documentation: Swagger/OpenAPI
- GraphQL: Apollo Server with Express integration
- AI integration: Ollama local models, including `qwen2.5-coder:7b` and `qwen3:8b`
- Security middleware: Helmet, CORS, HPP, rate limiting, XSS cleaning, SQL injection guard

## Implemented Functionality

### User Authentication

- User registration API with validation for first name, last name, username, email, password, date of birth, and gender.
- Disposable and temporary email domain checks during registration and login.
- Password hashing with bcrypt.
- Login with either email or username.
- JWT generation after successful registration/login.
- Cookie-based authentication using the `token` cookie.
- Protected `/auth/me` endpoint for verifying the currently logged-in user.
- React auth context for loading and refreshing authenticated user state.
- Protected frontend routes for dashboard, profile, and device pages.

### Security and Abuse Protection

- XSS cleaning for request payloads.
- SQL injection detection middleware.
- General rate limiting of 100 requests per 15 minutes.
- Login brute-force protection using Redis counters.
- Fake password hash comparison to reduce timing-based user enumeration during login.
- HTTP security headers through Helmet.
- HTTP parameter pollution protection through HPP.
- Request logging through Morgan and Winston.
- Spoofed server headers middleware to reduce useful fingerprinting.

### User Profile

- Protected profile API at `/auth/myprofile`.
- User profile data is fetched from MySQL and cached in Redis.
- Cached profile data is reused on later requests.
- Profile update endpoints for first name, last name, email, and a partially started username update flow.
- Frontend `MyProfile` page that calls the profile API.

### Device Inventory

- The frontend creates or reuses a browser device UUID through `localStorage`.
- Registration and login requests send the device UUID to the backend.
- Backend parses the user agent to store browser, OS, architecture, device type, vendor, and model details.
- Device records are stored or updated in the `devices` table.
- User-to-device mappings are maintained in `user_devices`.
- Protected `/auth/mydevices` endpoint returns all registered devices for the logged-in user.
- Frontend `UserDevices` page calls the device inventory API.

### Communities

- Authenticated community creation endpoint at `/community/create`.
- Community creation supports multipart upload for a community icon.
- Community name, description, rules, and slug validation.
- Unique normalized community slug checks.
- Community creation uses a SQL transaction.
- Creator is automatically added as the first community member with the `admin` role.
- Public paginated community listing at `/community/all`.
- Home page fetches communities and renders them in the main feed area.
- Protected route exists for fetching a specific community by slug, though this route still needs cleanup.

### Chatrooms

- Chatroom creation API at `/room/create`.
- Chatroom creation validates name and description.
- Each new chatroom gets a generated UUID.
- Protected `/room/all` endpoint is scaffolded for future chatroom listing.
- Socket.IO server is initialized and logs client connections.
- Frontend chatroom page exists and is wired to call the chatroom API, but the UI is still placeholder-like.

### AI Features

- Protected AI route at `/ai/askllm`.
- Sends user prompts to a local Ollama model.
- `qwen2.5-coder:7b` is used for the active `/askllm` route.
- `qwen3:8b` support and model verification utilities are also present.
- Search helper utilities exist for Google automation and DuckDuckGo scraping.

### GraphQL

- Apollo Server is integrated at `/graphql`.
- A `User` GraphQL type is defined.
- `getUsers` query is currently implemented as a simple resolver returning sample user data.

### API Docs

- Swagger/OpenAPI setup is available at `/api-docs`.
- Swagger is configured to scan route files from the `routes` directory.

### Frontend Screens

- Home page with hero section, trending topics, sidebar/menu areas, community feed, and guest callout.
- Signup page with registration form fields.
- Login page with email/username login and device UUID handling.
- Dashboard page that greets the authenticated user.
- Protected profile page that fetches logged-in user details.
- Protected devices page that fetches registered device details.
- Chatroom page scaffold connected to the chatroom API.
- Navbar, input bar, shared styles, and route protection components.

## Current Project State

The core backend foundation is implemented with authentication, validation, device tracking, community creation/listing, Redis caching, security middleware, Swagger, GraphQL setup, Socket.IO setup, and local AI support.

The frontend has the main routing, authentication context, protected routes, and API service layer in place. Some pages already call backend APIs, while a few UI sections are still placeholders or early scaffolds.

## Areas Still In Progress

- Complete chatroom listing, persistence, joining, and real-time message events.
- Finish community detail route cleanup and frontend community detail pages.
- Complete username update and delete account flows.
- Expand GraphQL resolvers beyond sample data.
- Render profile and device API data fully in the frontend.
- Add post creation, comments, likes, and voting features if the Reddit-style feed is continued.
- Add automated tests for auth, validation, community creation, and device tracking.
