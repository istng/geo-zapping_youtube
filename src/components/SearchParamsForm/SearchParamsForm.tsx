import { useForm, Controller } from 'react-hook-form';
import { NumberInput, Select, Button, Stack } from '@mantine/core';

interface SearchParams {
  radius: number;
  orderBy: string;
  maxResults: number;
}

const orderByOptions = [
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'viewCount', label: 'View Count' },
];

export function SearchParamsForm({ onSubmit, initialValues }: { onSubmit?: (data: SearchParams) => void, initialValues?: SearchParams }) {
  const { handleSubmit, control } = useForm<SearchParams>({
    defaultValues: initialValues || { radius: 3000, orderBy: 'date', maxResults: 20 },
  });

  return (
    <form onSubmit={handleSubmit(data => onSubmit?.(data))}>
      <Stack>
        <Controller
          name="radius"
          control={control}
          rules={{ min: 500, max: 5000, required: true }}
          render={({ field, fieldState }) => (
            <NumberInput
              label="Radius (meters)"
              min={500}
              max={5000}
              step={100}
              {...field}
              error={fieldState.error && 'Radius must be between 500 and 5000'}
            />
          )}
        />
        <Controller
          name="orderBy"
          control={control}
          render={({ field }) => (
            <Select
              label="Order By"
              data={orderByOptions}
              {...field}
            />
          )}
        />
        <Controller
          name="maxResults"
          control={control}
          rules={{ min: 4, max: 50, required: true }}
          render={({ field, fieldState }) => (
            <NumberInput
              label="Max Results"
              min={4}
              max={50}
              step={1}
              {...field}
              error={fieldState.error && 'Max results must be between 4 and 50'}
            />
          )}
        />
        <Button type="submit">Search</Button>
      </Stack>
    </form>
  );
}
