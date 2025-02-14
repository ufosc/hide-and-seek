# Hide-And-Seek

This is a mobile app developed by UF OSC to allow for playing "Hide and Seek" by Jet Lag The Game.

# Installation

We use yarn as our package manager
```sh
npm install -g yarn@1
yarn install
```

We need docker to run our supabase database.

If you are windows, ensure you have WSL installed. [Installation guide](https://learn.microsoft.com/en-us/windows/wsl/install)
```sh
wsl --install
```

Install on Ubuntu (or WSL)
Follow [this](https://docs.docker.com/engine/install/ubuntu/) link. Installing using the apt repository should work.
Once "Hello World" succeeds you should be done.

## Thingies
Ensure that your npm and node versions are up to date. You might need to install nvm to update.

This Turborepo includes the following packages/apps:

## Running
Now do:
```sh
npm run dev
```

### Apps and Packages

- `native`: a [react-native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `web`: a [Next.js](https://nextjs.org/) app built with [react-native-web](https://necolas.github.io/react-native-web/)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting
