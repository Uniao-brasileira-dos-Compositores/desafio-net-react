import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast, confirmDelete } from '../utils/swal'; // Importando do seu utilitário Swal
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, Chip,
  AppBar, Toolbar, Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions
} from '@mui/material';
import { Add, Edit, Delete, ExitToApp, School, Save, Close } from '@mui/icons-material';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null, nome: '', idade: '', serie: '', notaMedia: '', 
    endereco: '', nomePai: '', nomeMae: '', dataNascimento: ''
  });

  const loadStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch { 
      toast.fire({ icon: 'error', title: 'Erro ao carregar dados.' }); 
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleOpen = (student = null) => {
    if (student) {
      setFormData({ ...student, dataNascimento: student.dataNascimento.split('T')[0] });
    } else {
      setFormData({ id: null, nome: '', idade: '', serie: '', notaMedia: '', endereco: '', nomePai: '', nomeMae: '', dataNascimento: '' });
    }
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        await api.put(`/students/${formData.id}`, formData);
        toast.fire({ icon: 'success', title: 'Estudante atualizado!' });
      } else {
        await api.post('/students', formData);
        toast.fire({ icon: 'success', title: 'Estudante cadastrado!' });
      }
      setOpen(false);
      loadStudents();
    } catch {
      toast.fire({ icon: 'error', title: 'Erro ao salvar dados.' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    // Usando seu utilitário confirmDelete que criamos antes
    const result = await confirmDelete('Excluir?', 'Deseja realmente remover este aluno?');
    
    if (result.isConfirmed) {
      try {
        await api.delete(`/students/${id}`);
        loadStudents();
        toast.fire({ icon: 'success', title: 'Removido com sucesso!' });
      } catch {
        toast.fire({ icon: 'error', title: 'Erro ao excluir.' });
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', bgcolor: '#f0f2f5' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <School />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>UBC - Portal Acadêmico</Typography>
          </Box>
          <Button color="inherit" startIcon={<ExitToApp />} onClick={() => { localStorage.clear(); navigate('/'); }}>SAIR</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, flexGrow: 1 }}>
        <Paper elevation={2} sx={{ borderRadius: 4, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e' }}>Gestão de Alunos</Typography>
            <Button variant="contained" size="large" startIcon={<Add />} onClick={() => handleOpen()} sx={{ borderRadius: 3, px: 4 }}>
              Novo Estudante
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Aluno</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Série</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nota Média</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>{s.nome[0].toUpperCase()}</Avatar>
                        <Typography sx={{ fontWeight: 600 }}>{s.nome}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{s.serie}º Ano</TableCell>
                    <TableCell>
                      <Chip label={s.notaMedia} color={s.notaMedia >= 7 ? "success" : "warning"} variant="outlined" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpen(s)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(s.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between' }}>
          {formData.id ? 'Editar Estudante' : 'Novo Estudante'}
          <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nome" required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} /></Grid>
              <Grid item xs={6} md={3}><TextField fullWidth label="Idade" type="number" required value={formData.idade} onChange={e => setFormData({...formData, idade: e.target.value})} /></Grid>
              <Grid item xs={6} md={3}><TextField fullWidth label="Série" type="number" required value={formData.serie} onChange={e => setFormData({...formData, serie: e.target.value})} /></Grid>
              <Grid item xs={6} md={4}><TextField fullWidth label="Nota Média" type="number" inputProps={{step: 0.1}} required value={formData.notaMedia} onChange={e => setFormData({...formData, notaMedia: e.target.value})} /></Grid>
              <Grid item xs={6} md={8}><TextField fullWidth label="Endereço" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nome do Pai" value={formData.nomePai} onChange={e => setFormData({...formData, nomePai: e.target.value})} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nome da Mãe" value={formData.nomeMae} onChange={e => setFormData({...formData, nomeMae: e.target.value})} /></Grid>
              <Grid item xs={12}><TextField fullWidth type="date" label="Data de Nascimento" InputLabelProps={{ shrink: true }} required value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}