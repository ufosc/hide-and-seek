// If adding a new route, make sure to import and export it in this file!
import { router } from "./trpc.ts";
import { gameRouter } from "./routers/game.ts";
import { userRouter } from "./routers/user.ts";
// import your router here

export const appRouter = router({
  game: gameRouter,
  user: userRouter,
  // export your router here and set the name of the router as the key
});

export type AppRouter = typeof appRouter;
