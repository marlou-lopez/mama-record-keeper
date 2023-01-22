import { Flex, Popover, Text, UnstyledButton } from '@mantine/core';
import { Calendar, getMonthsNames } from '@mantine/dates';
import { useHotkeys } from '@mantine/hooks';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

type CustomDatePickerProps = {
  value: dayjs.Dayjs;
  onChange: (date: dayjs.Dayjs) => void;
};

export default function CustomDatePicker({
  value,
  onChange,
}: CustomDatePickerProps) {
  const month = getMonthsNames('en', 'MMMM')[value.month()];
  const day = value.date();

  const goToNextDate = () => {
    onChange(value.add(1, 'day'));
  };

  const goToPreviousDate = () => {
    onChange(value.subtract(1, 'day'));
  };

  useHotkeys([
    ['ctrl+ArrowLeft', goToPreviousDate],
    ['ctrl+ArrowRight', goToNextDate],
  ]);

  return (
    <>
      <Flex align={'center'} justify={'space-between'}>
        <UnstyledButton c={'gray.8'} onClick={() => goToPreviousDate()}>
          <ChevronLeft size={50} />
        </UnstyledButton>
        <Popover withArrow trapFocus>
          <Popover.Target>
            <UnstyledButton>
              <Flex direction={'column'} align={'center'}>
                <Text size={24} fw={400} c={'gray.8'}>
                  {month}
                </Text>
                <Text size={50} c={'gray.8'} fw={'bold'}>
                  {day}
                </Text>
              </Flex>
            </UnstyledButton>
          </Popover.Target>
          <Popover.Dropdown>
            <Calendar
              focusable
              value={value.toDate()}
              initialMonth={value.toDate()}
              onChange={(d) => {
                const selectedDay = d?.getDate() ?? 1;
                const selectedMonth = d?.getMonth() ?? 0;
                const newDate = value.set('month', selectedMonth);
                onChange(newDate.set('date', selectedDay));
              }}
            />
          </Popover.Dropdown>
        </Popover>
        <UnstyledButton c={'gray.8'} onClick={() => goToNextDate()}>
          <ChevronRight size={50} />
        </UnstyledButton>
      </Flex>
    </>
  );
}
