import { useState } from 'react';
import { useLoginMutation } from '../hooks/useLoginMutation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isError, error } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Iniciar sesión</button>

      {isError && <div role="alert">{(error as Error).message}</div>}
    </form>
  );
}
