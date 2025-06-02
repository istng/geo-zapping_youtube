import { useForm, Controller } from 'react-hook-form';
import { NumberInput, Select, Stack } from '@mantine/core';

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

export function SearchParamsForm({ values, onChange }: { values: SearchParams, onChange: (data: SearchParams) => void }) {
  const { control } = useForm<SearchParams>({
    defaultValues: values,
    values,
  });

  // Call onChange whenever a field changes
  return (
    <form>
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
              value={field.value}
              onChange={val => {
                field.onChange(val);
                onChange({ ...values, radius: typeof val === 'number' ? val : parseInt(val || '0', 10) });
              }}
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
              value={field.value}
              onChange={val => {
                field.onChange(val);
                onChange({ ...values, orderBy: val ?? '' });
              }}
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
              value={field.value}
              onChange={val => {
                field.onChange(val);
                onChange({ ...values, maxResults: typeof val === 'number' ? val : parseInt(val || '0', 10) });
              }}
              error={fieldState.error && 'Max results must be between 4 and 50'}
            />
          )}
        />
        {/* Removed the Search button, now controlled by parent */}
      </Stack>
    </form>
  );
}
