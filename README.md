# Hide and Seek Project

Welcome to the UF Open Source Club's "Hide and Seek" Project. An app that allows
you to play Hide and Seek across campus in the style of
[Jetlag](https://www.youtube.com/watch?v=PHjkSKQSzv4)!

If you want to get started contributing, check out our
[documentation](https://hide-and-seek-lac.vercel.app/)!

## Helpful Links

🖌️[Figma Mockup](https://www.figma.com/design/SNNLRoLLpGsOfBPUgeeoaw/OSC-Hide-and-Seek?node-id=2-2&t=4aAjksykaIuTcMgX-1)

📖 [Documentation](https://hide-and-seek-lac.vercel.app/)

## Project Structure

This repo is structured as a monorepo and contains the following main directories:

```
|-- apps/
|   |-- docs/ : Next.js documentation project using Nextra for documentation
|   |   |-- pages/ : Documentation pages
|   |-- mobile/ : Mobile app project (React Native)
|   |   |-- components/ : Reusable UI components (e.g., HelloWave.tsx)
|   |-- supabase/ : Supabase backend functions and configuration
|   |   |-- functions/ : Database triggers and API functions
|-- packages/
|   |-- eslint-config/ : Configuration for ESLint
|   |-- schema/ : Database schema definitions and related files
|   |-- shared-types/ : Types shared between different parts of the project
|   |-- typescript-config/ : Base TypeScript configuration
```

## Getting Started

### Installing Dependencies & First Time Setup

1. Install the package manager, yarn (must be version 1)

```
npm install -g yarn@1
```

2. Install dependencies

```
yarn install
```

3. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) to host the server edge functions

   - If you're running this project on WSL, please instead install [Docker on Linux](https://docs.docker.com/desktop/setup/install/linux/) and follow the [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/).
   - (on Windows only) Ensure that you enable `Expose daemon on tcp://localhost:2375 without TLS` inside `settings->general` in Docker Desktop

4. To test server functions, download [Postman](https://www.postman.com/)

   - Recommended, but not necessary

6. Make a [Supabase](https://supabase.com) account and project

   - Turn off email authentication: Authentication -> Sign In / Up -> Email -> Confirm email.

7. Download the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows&queryGroups=access-method&access-method=kong)

   - If you are using Windows, install Supabase using [Scoop](https://scoop.sh/)

8. Make a [ngrok](https://dashboard.ngrok.com/) account and download the CLI. 

   - Run `ngrok config add-authtoken <tokenFromAccount>`

9. Start ngrok with `ngrok http 54321`

10. Create env files by copying the .env.example files inside `packages/schema`, `apps/supabase/functions`, and `apps/mobile` and renaming the copies to `.env`

    - Follow the steps in each ```.env.example``` to fill out each required key.

### Running App

Every time you run the app, you will need to run some of the following commands.

*Pushing to Database*: You will need to push your Database tables to supabase by running:

```
yarn run db:push
```

If this doesn't work, try resetting your database password in Supabase: 
   - Project Settings -> database -> reset password

*Running Ngrok*

If you don't have ngrok open, run it with:

```ngrok http 54321```

Copy the forwarded url and paste it into `apps/mobile/.env` as the .env.example says. (Don't forget the `/functions/v1` at the end)

*Running the App*: You may run the frontend and backend either together:

```
yarn run dev
```

or separately:

```
yarn run dev:mobile
yarn run dev:supabase
```

It's recommended you do it separately if you're working on the backend and will need to restart your supabase edge functions frequently, otherwise together is perfectly fine.

## Troubleshooting

- `ngrok tunnel took too long to connect`
  - Try disabling the windows firewall

## Code Formatting & Linting

Each project adheres to consistent code style. Each time before you push
changes, run the following commands:

### Prettier

- Prettier will automatically format your code so our project has consistent
  formatting and line spacing

- To format your code using Prettier in the project, run the following commands
  in the root project directory:

  ```
  npx prettier --write .
  ```

### Linting

- The linter ensures that your code does not have any errors.
- To run the linter for the mobile app or docs project, use:

  ```
  yarn run lint
  ```

Happy coding and thanks for contributing!
