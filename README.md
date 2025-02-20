<<<<<<< HEAD
# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
=======
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

## Running the mobile app, server, and docs

1. Install the package manager, yarn (must be version 1)

```
npm install -g yarn@1
```

1. Install dependencies

```
yarn install
```

2. Start the program

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

## Adding to the documentation

Edit Markdown files in the `pages/` directory. Your changes will be
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
>>>>>>> 81ce453a39d93dff2dfda0240fb511f6e901d647
