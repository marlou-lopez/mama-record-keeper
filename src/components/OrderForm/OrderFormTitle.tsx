import { Text } from '@mantine/core';

type OrderFormTitle = {
  title: string;
};

export default function OrderFormTitle({ title }: OrderFormTitle) {
  return (
    <Text fw={'bold'} fz={32}>
      {title}
    </Text>
  );
}
