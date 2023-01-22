import { router } from '../trpc';
import { orderRouter } from './order';
import { restaurantRouter } from './restaurant';

export const appRouter = router({
  restaurant: restaurantRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
