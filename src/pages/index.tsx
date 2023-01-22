import CustomDatePicker from '@/components/CustomDatePicker';
import OrderForm from '@/components/OrderForm';
import OrderFormTitle from '@/components/OrderForm/OrderFormTitle';
import OrderList from '@/components/OrderList';
import { trpc } from '@/utils/trpc';
import {
  Text,
  Button,
  Container,
  Flex,
  HoverCard,
  Kbd,
  Modal,
  Center,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Plus } from 'tabler-icons-react';

export default function Home() {
  const trpcUtils = trpc.useContext();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  useHotkeys([['ctrl+Enter', () => setIsOrderFormOpen(true)]]);

  const { mutate } = trpc.restaurant.add.useMutation({
    async onSuccess() {
      await trpcUtils.restaurant.invalidate();
    },
  });

  const { mutate: addOrder } = trpc.order.add.useMutation({
    async onSuccess() {
      await trpcUtils.restaurant.invalidate();
      showNotification({
        message: 'Order successfully submitted!',
      });
    },
    onError(error) {
      showNotification({ message: error.message });
    },
  });

  const handleRestaurantAdd = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault();

    mutate({
      name: restaurantName,
      description: restaurantDescription,
    });
  };

  return (
    <Container
      size={'xs'}
      sx={{
        height: '100%',
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <CustomDatePicker value={currentDate} onChange={setCurrentDate} />
      <Flex justify={'flex-end'}>
        <HoverCard openDelay={500} width={260} shadow={'md'}>
          <HoverCard.Target>
            <Button
              onClick={() => setIsOrderFormOpen(true)}
              size="sm"
              leftIcon={<Plus size={16} />}
            >
              Add Order
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Center>
              <Text size={'sm'}>
                You can also press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
              </Text>
            </Center>
          </HoverCard.Dropdown>
        </HoverCard>
      </Flex>
      <OrderList date={currentDate.toDate().toLocaleDateString()} />
      <Modal
        opened={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        title={<OrderFormTitle title="Add Order" />}
        overlayOpacity={0.55}
        overlayBlur={3}
        transition={'slide-down'}
        transitionDuration={500}
        exitTransitionDuration={250}
      >
        <OrderForm
          mode="CREATE"
          date={currentDate}
          onCancel={() => setIsOrderFormOpen(false)}
          onSubmit={(formValues) => {
            addOrder(formValues);
            setIsOrderFormOpen(false);
          }}
        />
      </Modal>
      {/* <form onSubmit={handleRestaurantAdd}>
        <TextInput
          placeholder="Enter restaurant name"
          label="Name"
          withAsterisk
          value={restaurantName}
          onChange={(event) => setRestaurantName(event.target.value)}
        />
        <Textarea
          placeholder="Enter restaurant description (optional)"
          label="Description"
          value={restaurantDescription}
          onChange={(event) => setRestaurantDescription(event.target.value)}
        />

        <Button type="submit" onClick={handleRestaurantAdd} mt={4}>
          Add
        </Button>
      </form>
      {restaurants && restaurants.length > 0 ? (
        <Flex direction={'column'} align={'center'} gap={'md'}>
          {restaurants.map((restaurant) => (
            <Text key={restaurant.id}>{restaurant.name}</Text>
          ))}
        </Flex>
      ) : (
        <Text>No restaurant</Text>
      )} */}
    </Container>
  );
}
