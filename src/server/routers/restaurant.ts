import { z } from 'zod';
import { prisma } from '../prisma';
import { procedure, router } from '../trpc';

export const restaurantRouter = router({
  getAllWithOrders: procedure
    .input(
      z.object({
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { date } = input;
      const selectedDate = new Date(date);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      return await prisma.restaurant.findMany({
        include: {
          orders: {
            where: {
              issuedAt: {
                lte: endDate,
                gt: selectedDate,
              },
            },
          },
        },
      });
    }),
  getAll: procedure
    .input(
      z
        .object({
          includeOrders: z.boolean().optional(),
          date: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let selectedDate;
      let endDate;
      if (input && input.date) {
        (selectedDate = new Date(input.date)),
          (endDate = new Date(selectedDate));
        endDate.setDate(endDate.getDate() + 1);
      }
      return await prisma.restaurant.findMany({
        where: {
          orders: {
            ...(!!(input && input.includeOrders) && {
              some: {
                issuedAt: {
                  gte: selectedDate,
                  lt: endDate,
                },
              },
            }),
          },
        },
        include: {
          orders: !!(input && input.includeOrders),
        },
      });
    }),
  getById: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      return await prisma.restaurant.findUnique({
        where: { id },
      });
    }),
  add: procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, description } = input;
      return await prisma.restaurant.create({
        data: {
          name,
          description,
        },
      });
    }),
  deleteById: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      return await prisma.restaurant.delete({ where: { id } });
    }),
  update: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await prisma.restaurant.update({
        where: { id },
        data: { ...rest },
      });
    }),
});
