import { trpc } from '@/utils/trpc';
import {
  Text,
  Button,
  Flex,
  Group,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { TransformedValues, useForm, zodResolver } from '@mantine/form';
import dayjs from 'dayjs';
import { z } from 'zod';

interface FormValues {
  issuedAt: Date;
  restaurantId: string;
  amount: number;
  description: string | null;
}

interface TransformedFormValues extends Omit<FormValues, 'issuedAt'> {
  issuedAt: string;
}

export const FormType = {
  CREATE: 'CREATE',
} as const;

type OrderFormProps =
  | {
      mode: 'CREATE';
      date?: dayjs.Dayjs;
      onSubmit: (values: TransformedFormValues) => void;
      onCancel?: () => void;
    }
  | {
      mode: 'UPDATE';
      onSubmit: (values: TransformedFormValues) => void;
      onCancel?: () => void;
      order: FormValues;
    };

const formSchema = z.object({
  restaurantId: z
    .string({
      required_error: 'Restaurant is required.',
    })
    .uuid('Restaurant is required.'),
  amount: z
    .number({
      required_error: 'Amount is required.',
    })
    .min(1, 'Amount must be greater than 0'),
  issuedAt: z.date({
    invalid_type_error: 'Date is invalid.',
  }),
});

const FormLabel = ({ label }: { label: string }) => {
  return (
    <Text fw={'bold'} color="violet.6">
      {label}
    </Text>
  );
};
export default function OrderForm(props: OrderFormProps) {
  const { onSubmit, onCancel, mode } = props;

  const issuedAt =
    mode === 'UPDATE'
      ? props.order.issuedAt
      : props.date
      ? props.date.toDate()
      : new Date();

  const initialValues =
    mode === 'UPDATE'
      ? { ...props.order, issuedAt }
      : {
          issuedAt,
          restaurantId: '',
          amount: 0,
          description: '',
        };

  const form = useForm({
    initialValues,
    validate: zodResolver(formSchema),
    transformValues(values) {
      return {
        ...values,
        issuedAt: values.issuedAt.toISOString(),
      };
    },
  });

  const { data } = trpc.restaurant.getAll.useQuery(undefined, {
    select(data) {
      return data.map<SelectItem>((d) => ({
        label: d.name,
        value: d.id,
      }));
    },
  });

  const handleFormSubmit = (values: TransformedValues<typeof form>) => {
    onSubmit && onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Flex gap={8} direction={'column'}>
        <DatePicker
          withAsterisk={false}
          required
          label={<FormLabel label="Date Issued" />}
          tabIndex={issuedAt ? -1 : 0}
          readOnly={!!issuedAt}
          variant={issuedAt ? 'default' : 'default'}
          size={'lg'}
          {...form.getInputProps('issuedAt')}
        />
        <Select
          withAsterisk={false}
          required
          data-autofocus
          label={<FormLabel label="Restaurant" />}
          placeholder="Select restaurant"
          size={'lg'}
          data={data ?? []}
          {...form.getInputProps('restaurantId')}
        />
        <NumberInput
          withAsterisk={false}
          required
          label={<FormLabel label="Amount" />}
          placeholder="Enter amount"
          size={'lg'}
          hideControls
          min={0}
          parser={(value) => value && value.replace(/\₱\s?|(,*)/g, '')}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value || '0'))
              ? `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '₱ '
          }
          {...form.getInputProps('amount')}
        />
        <Textarea
          label={<FormLabel label="Description" />}
          placeholder="Add description (Optional)"
          size={'lg'}
          {...form.getInputProps('description')}
        />
      </Flex>
      <Flex mt={24} justify={'end'}>
        <Group>
          {onCancel && (
            <Button variant="light" onClick={() => onCancel()}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {mode === 'CREATE' ? 'Submit Order' : 'Update Order'}
          </Button>
        </Group>
      </Flex>
    </form>
  );
}
