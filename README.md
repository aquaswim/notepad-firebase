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

## Password-protected notes

Open a normal note and select **Protect with password** to encrypt it. The browser derives an AES-256-GCM encryption key from the password using PBKDF2/SHA-256 and stores only the encrypted text, unique salt, and IV in Firebase. The password and encryption key are never written to Firebase; the key only remains in the current browser page's memory after unlocking.

Firebase stores protected notes in this form:

```json
{
  "secret": true,
  "encryptedText": "...",
  "salt": "...",
  "iv": "..."
}
```

Passwords cannot be recovered. This feature provides content confidentiality for Firebase data, but the default database rules still allow anyone with a document ID to read or overwrite that location. Use Firebase Authentication and restrictive database rules when you also need access control and tamper resistance.
