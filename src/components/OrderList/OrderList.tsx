import { trpc } from '@/utils/trpc';
import { Flex, Text, Center, Loader } from '@mantine/core';
import OrderListItem from './OrderListItem';

type OrderListProps = {
  date: string;
};

export function addCurrencyToText(text: string | number) {
  let amount = text;
  if (typeof text === 'string') {
    amount = amount.toString();
  }
  return `₱ ${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function OrderList({ date }: OrderListProps) {
  const { data: restaurants, isLoading } =
    trpc.restaurant.getAllWithOrders.useQuery({
      date,
    });

  if (isLoading) {
    return (
      <Flex sx={{ flexGrow: 1 }} justify={'center'} align={'center'}>
        <Loader size={'xl'} variant={'dots'} />
      </Flex>
    );
  }

  return (
    <>
      {restaurants && restaurants.length ? (
        <Flex
          direction={'column'}
          sx={{
            overflowY: 'auto',
            marginBottom: 16,
          }}
          gap={8}
          pb={8}
        >
          {restaurants.map((restaurant) => {
            return (
              <div key={restaurant.id}>
                <Flex justify={'space-between'} align={'center'}>
                  <Text fw={600} c={'violet'} fz={20}>
                    {restaurant.name}
                  </Text>
                  {restaurant.orders.length ? (
                    <Text c={'green'} fz={18} fw={500}>
                      {addCurrencyToText(
                        restaurant.orders.reduce(
                          (acc, cur) => acc + cur.amount,
                          0
                        )
                      )}
                    </Text>
                  ) : null}
                </Flex>
                <Flex direction={'column'} gap={4}>
                  {restaurant.orders.length ? (
                    restaurant.orders.map((order) => {
                      return <OrderListItem key={order.id} order={order} />;
                    })
                  ) : (
                    <Center>
                      <Text c={'dimmed'}>
                        No order for this restaurant on this date.
                      </Text>
                    </Center>
                  )}
                </Flex>
              </div>
            );
          })}
        </Flex>
      ) : null}
    </>
  );
}
