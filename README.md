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

## Running the Mobile App

1. Navigate to the `mobile/` directory:

   ```
   cd mobile
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the app:

   ```
   npm run dev
   ```

## Running and Contributing to the Docs

Our docs are built with Next.js & Nextra. To contribute:

1. Navigate to the `docs/` directory:

   ```
   cd docs
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

4. Edit Markdown files in the `pages/` directory. Your changes will be
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
  npm run lint
  ```

  (Ensure you are in the respective project folder, or adjust the command if
  running from the root.)

Happy coding and thanks for contributing!
