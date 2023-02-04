import CustomDatePicker from '@/components/CustomDatePicker';
import OrderForm from '@/components/OrderForm';
import OrderFormTitle from '@/components/OrderForm/OrderFormTitle';
import OrderList from '@/components/OrderList';
import PrintRecordForm from '@/components/PrintRecordForm';
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
  ActionIcon,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { BuildingStore, Hammer, Plus, Printer } from 'tabler-icons-react';

export default function Home() {
  const trpcUtils = trpc.useContext();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  useHotkeys([['ctrl+Enter', () => setIsOrderFormOpen(true)]]);
  useHotkeys([['ctrl+O', () => setIsActionModalOpen((s) => !s)]]);

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
      <Flex justify={'space-between'} align={'center'}>
        <Text fz={16} c={'violet'} fw={'bolder'}>
          Mama Record Keeper
        </Text>
        <ActionIcon
          c={'violet'}
          onClick={() => {
            setIsActionModalOpen(true);
          }}
        >
          <Hammer />
        </ActionIcon>
      </Flex>
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
      <Modal
        opened={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        overlayOpacity={0.55}
        overlayBlur={3}
        transition={'slide-down'}
        transitionDuration={500}
        exitTransitionDuration={250}
        centered
        size={'xs'}
        withCloseButton={false}
      >
        <Flex direction={'column'} gap={4}>
          <Button
            onClick={() => setIsPrintModalOpen(true)}
            size="lg"
            leftIcon={<Printer />}
            variant="white"
          >
            Print Records
          </Button>
          <Button size="lg" leftIcon={<BuildingStore />} variant="white">
            Manage Restaurants
          </Button>
        </Flex>
      </Modal>
      <Modal
        opened={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        fullScreen
        title={<OrderFormTitle title="Print Records" />}
        styles={{
          modal: {
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            flexGrow: 1,
          },
        }}
      >
        <PrintRecordForm />
      </Modal>
    </Container>
  );
}
