# Hide and Seek Project

Welcome to the UF Open Source Club's "Hide and Seek" Project. An app that allows
you to play Hide and Seek across campus in the style of
[Jetlag](https://www.youtube.com/watch?v=PHjkSKQSzv4)!

If you want to get started contributing, check out our
[documentation](https://hide-and-seek-lac.vercel.app/)!

## Helpful Links

🖌️
[Figma Mockup](https://www.figma.com/design/SNNLRoLLpGsOfBPUgeeoaw/OSC-Hide-and-Seek?node-id=2-2&t=4aAjksykaIuTcMgX-1)

📖 [Documentation](https://hide-and-seek-lac.vercel.app/)

## Project Structure

This repo contains three main folders: _docs_, _mobile_, and _supabase_

```
|-- docs/             # Next.js docs project using Nextra for documentation
|   |-- pages/        # Documentation pages
|
|-- mobile/           # Mobile app project (React Native)
|   |-- components/   # UI components (e.g., HelloWave.tsx)
|   |-- ...other code...
|
|-- supabase/         # Supabase backend functions and configuration
|   |-- functions/    # Database triggers and API functions
|   |-- ...other code...
|
|-- package.json      # Root project configuration for prettier only (as of right now)
|-- ...other files...
```

## Getting Started

1. Install the package manager, yarn (must be version 1)

```
npm install -g yarn@1
```

2. Install dependencies

```
yarn install
```

3. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) to host the server edge functions

4. Ensure that you enable `Expose daemon on tcp://localhost:2375 without TLS` inside `settings->general` in Docker Desktop

5. To test server functions, download [Postman](https://www.postman.com/)

6. Create env files by copying the .env.example files inside `packages/schema` and `supabase/functions` and renaming the copies to `.env`

7. Make a [Supabase](https://supabase.com) accont

   - Get your connection string by clicking the connect button at the top of the page and copying the `transaction pooler` string
   - Add your connection string and password into the env files inside `packages/schema` and `supabase/functions`

8. Start the program

```
yarn run dev
```

You can also run each package separately with the following commands:

- To run the docs project:

  ```
  yarn run dev:docs
  ```

- To run the mobile app:

  ```
  yarn run dev:mobile
  ```

- To run the supabase server:
  ```
  yarn run dev:supabase
  ```

## Troubleshooting

- `ngrok tunnel took too long to connect`
  - Try disabling the windows firewall

## Adding to the documentation

Edit Markdown files in the `apps/content/` directory. Your changes will be
live-reloaded by Nextra.

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
