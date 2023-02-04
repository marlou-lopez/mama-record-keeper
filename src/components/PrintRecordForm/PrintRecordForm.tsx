import { trpc } from '@/utils/trpc';
import { Button, Flex, Container, Center } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { Order, Restaurant } from '@prisma/client';
import { useState } from 'react';
import PrintView from '../PrintView';

export type MapType = Order & { restaurant: Pick<Restaurant, 'name'> };

export type FilteredOrderByDateType = Record<string, Record<string, MapType[]>>;
const mapData = (orders: MapType[]) => {
  return orders.reduce<FilteredOrderByDateType>((acc, cur) => {
    const issueDate = cur.issuedAt.toLocaleDateString();
    const restaurantName = cur.restaurant.name;

    const existingDateKey = acc[issueDate] ?? {};
    acc[issueDate] = existingDateKey;

    const existingResKey = acc[issueDate][restaurantName] ?? [];
    acc[issueDate][restaurantName] = [...existingResKey, cur];

    return acc;
  }, {});
};
export default function PrintRecordForm() {
  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerValue>([
    null,
    null,
  ]);
  const { data, refetch } = trpc.order.getAll.useQuery(
    {
      startDate: dateRangeValue[0] ?? new Date(),
      endDate: dateRangeValue[1] ?? new Date(),
    },
    {
      enabled: false,
    }
  );
  const orderByDate = mapData(data ?? []);
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
      size={'xs'}
    >
      <Flex align={'end'} gap={8}>
        <DateRangePicker
          value={dateRangeValue}
          onChange={setDateRangeValue}
          sx={{ flexGrow: 1 }}
          placeholder="Select Date Range"
        />
        <Button
          disabled={dateRangeValue.some((d) => d === null)}
          onClick={() => refetch()}
        >
          Show Records
        </Button>
      </Flex>
      <Flex
        direction={'column'}
        sx={{
          flexGrow: 1,
        }}
        pt={16}
        pb={16}
      >
        {data ? (
          <PrintView dateRange={dateRangeValue} data={orderByDate} />
        ) : (
          <Center>Select date</Center>
        )}
      </Flex>
    </Container>
  );
}
