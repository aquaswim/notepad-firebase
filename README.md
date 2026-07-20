# FireNote

A lightweight realtime notepad built with React, TypeScript, Vite, and Firebase Realtime Database.

## Requirements

- Node.js 24.12.0 (provided by the included [Devbox](https://www.jetify.com/devbox) configuration)
- A Firebase project with Realtime Database enabled

## Setup

1. Install dependencies:

   ```sh
   devbox run npm install
   ```

2. Copy `.env.example` to `.env.local` and populate it with your Firebase web-app configuration values.

3. Start the development server:

   ```sh
   devbox run npm run dev
   ```

## Available commands

```sh
devbox run npm run dev      # Run the Vite development server on port 3000
devbox run npm run build    # Type-check and create a production build
devbox run npm run lint     # Run ESLint's flat configuration
devbox run npm run preview  # Serve the production build locally
```

## Dependency maintenance

The project uses current, modular Firebase APIs and Lexical's React integration. After dependency changes, run:

```sh
devbox run npm audit --omit=dev
devbox run npm run lint
devbox run npm run build
```

`npm audit --omit=dev` verifies the production dependency graph without reporting development-tool-only findings.
