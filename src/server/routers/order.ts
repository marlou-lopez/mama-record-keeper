import { z } from 'zod';
import { prisma } from '../prisma';
import { procedure, router } from '../trpc';

export const orderRouter = router({
  getAll: procedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input;
      endDate.setDate(endDate.getDate() + 1);
      return await prisma.order.findMany({
        where: {
          issuedAt: {
            lte: endDate,
            gte: startDate,
          },
        },
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          {
            restaurant: {
              name: 'asc',
            },
          },
          {
            issuedAt: 'asc',
          },
        ],
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
      return await prisma.order.findUnique({
        where: { id },
      });
    }),
  add: procedure
    .input(
      z.object({
        restaurantId: z.string(),
        amount: z.number(),
        issuedAt: z.string().datetime(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { restaurantId, description, issuedAt, amount } = input;
      return await prisma.order.create({
        data: {
          restaurantId,
          amount,
          description,
          issuedAt,
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
      return await prisma.order.delete({ where: { id } });
    }),
  update: procedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().optional(),
        description: z.string().optional().nullable(),
        restaurantId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await prisma.order.update({
        where: { id },
        data: { ...rest },
      });
    }),
});
