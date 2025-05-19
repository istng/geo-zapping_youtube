import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Checkbox,
  Group,
  Anchor,
  Text,
  Alert,
  Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLoginMutation } from '../hooks/useLoginMutation';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function Login() {
  const { mutate, isError, error } = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await mutate({ email: values.email, password: values.password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="100vh">
    <Container size={420} p="md">
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt="sm" mb={30}>
        Don't have an account yet?{' '}
        <Anchor size="sm" component="button" fw={500}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              size="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              size="md"
              {...form.getInputProps('password')}
            />

            <Group justify="space-between" mt="xs">
              <Checkbox
                label="Remember me"
                size="sm"
                {...form.getInputProps('rememberMe', { type: 'checkbox' })}
              />
              <Anchor component="button" size="sm" fw={500}>
                Forgot password?
              </Anchor>
            </Group>

            {isError && (
              <Alert color="red" title="Error" variant="light" radius="md">
                {(error as Error).message}
              </Alert>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
    </Center>
  );
}
