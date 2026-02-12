import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';

export default function App() {
  const token = localStorage.getItem('@StudentApp:token');

  return (
    <BrowserRouter>
      {/* Adicione o ToastContainer aqui */}
      <ToastContainer autoClose={3000} position="top-right" />      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={token ? <StudentList /> : <Navigate to="/" />} />
        <Route path="/students/new" element={token ? <StudentForm /> : <Navigate to="/" />} />
        <Route path="/students/edit/:id" element={token ? <StudentForm /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}