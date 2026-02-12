import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button, TextField, Container, Typography, Box, Paper } from '@mui/material';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('@StudentApp:token', response.data.token);
      toast.success('Bem-vindo ao sistema!');
      navigate('/students');
    } catch {
      toast.error('Usuário ou senha inválidos!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>Portal do Aluno</Typography>
        <form onSubmit={handleLogin}>
          <TextField fullWidth margin="normal" label="Usuário" onChange={e => setUsername(e.target.value)} />
          <TextField fullWidth margin="normal" label="Senha" type="password" onChange={e => setPassword(e.target.value)} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, py: 1.5 }}>Entrar</Button>
        </form>
      </Paper>
    </Container>
  );
}