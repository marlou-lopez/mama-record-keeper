import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Flex,
  Menu,
  Modal,
  Paper,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Order } from '@prisma/client';
import { useState } from 'react';
import { Dots, Pencil, Trash } from 'tabler-icons-react';
import OrderForm from '../OrderForm';
import OrderFormTitle from '../OrderForm/OrderFormTitle';
import { addCurrencyToText } from './OrderList';

type OrderListItemProps = {
  order: Order;
};

export default function OrderListItem({ order }: OrderListItemProps) {
  const trpcUtils = trpc.useContext();
  const { mutate: deleteItem } = trpc.order.deleteById.useMutation({
    async onSuccess() {
      await trpcUtils.restaurant.invalidate();
      showNotification({
        message: 'Order successfully deleted.',
      });
    },
  });

  const { mutate: updateItem } = trpc.order.update.useMutation({
    async onSuccess() {
      await trpcUtils.restaurant.invalidate();
      showNotification({
        message: 'Order successfully updated.',
      });
    },
  });

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const handleDelete = (id: string) => {
    deleteItem({
      id,
    });
  };

  return (
    <>
      <Paper
        sx={(theme) => ({
          borderColor: theme.colors.violet[2],
        })}
        withBorder
        shadow={'md'}
        p={'md'}
      >
        <Flex direction={'column'}>
          <Flex justify={'space-between'} sx={{ flexGrow: 2 }}>
            <Text fz={'xl'} c={'gray.8'}>
              {addCurrencyToText(order.amount)}
            </Text>
            <Menu width={150} shadow={' xs'} position={'bottom-end'} offset={2}>
              <Menu.Target>
                <ActionIcon size={'xs'}>
                  <Dots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<Pencil size={16} />}
                  onClick={() => setIsOrderFormOpen(true)}
                >
                  <Text>Edit</Text>
                </Menu.Item>
                <Menu.Item
                  icon={<Trash size={16} color={'red'} />}
                  onClick={() => handleDelete(order.id)}
                >
                  <Text c={'red'}>Delete</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          {order.description ? (
            <Flex>
              <Text c={'dimmed'}>{order.description}</Text>
            </Flex>
          ) : null}
        </Flex>
      </Paper>
      <Modal
        title={<OrderFormTitle title="Edit Order" />}
        opened={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        overlayOpacity={0.55}
        overlayBlur={3}
        transition={'slide-down'}
        transitionDuration={500}
        exitTransitionDuration={250}
      >
        <OrderForm
          mode="UPDATE"
          order={order}
          onCancel={() => setIsOrderFormOpen(false)}
          onSubmit={(formValues) => {
            updateItem({ ...formValues, id: order.id });
            setIsOrderFormOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
