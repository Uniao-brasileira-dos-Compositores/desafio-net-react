import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Grid } from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    nome: '', idade: '', serie: '', notaMedia: '', endereco: '',
    nomePai: '', nomeMae: '', dataNascimento: ''
  });

  useEffect(() => {
    if (id) {
      api.get(`/students/${id}`).then(res => {
        // Formata a data para o input HTML (yyyy-MM-dd)
        const dataFormatada = res.data.dataNascimento.split('T')[0];
        setStudent({ ...res.data, dataNascimento: dataFormatada });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/students/${id}`, { ...student, id: parseInt(id) });
        toast.success('Dados atualizados!');
      } else {
        await api.post('/students', student);
        toast.success('Estudante cadastrado com sucesso!');
      }
      navigate('/students');
    } catch {
      toast.error('Erro ao salvar dados. Verifique o formulário.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>{id ? 'Editar' : 'Novo'} Estudante</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Nome" value={student.nome} onChange={e => setStudent({...student, nome: e.target.value})} required /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Idade" type="number" value={student.idade} onChange={e => setStudent({...student, idade: e.target.value})} required /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Série" type="number" value={student.serie} onChange={e => setStudent({...student, serie: e.target.value})} required /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Nota Média" type="number" value={student.notaMedia} onChange={e => setStudent({...student, notaMedia: e.target.value})} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Endereço" value={student.endereco} onChange={e => setStudent({...student, endereco: e.target.value})} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Nome do Pai" value={student.nomePai} onChange={e => setStudent({...student, nomePai: e.target.value})} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Nome da Mãe" value={student.nomeMae} onChange={e => setStudent({...student, nomeMae: e.target.value})} /></Grid>
            <Grid item xs={12}><TextField fullWidth type="date" label="Data de Nascimento" InputLabelProps={{ shrink: true }} value={student.dataNascimento} onChange={e => setStudent({...student, dataNascimento: e.target.value})} required /></Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" type="submit" color="primary">Salvar</Button>
            <Button variant="outlined" onClick={() => navigate('/students')}>Cancelar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}