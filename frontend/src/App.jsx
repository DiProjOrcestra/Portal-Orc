import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PainelInstitucional from './pages/PainelInstitucional/PainelInstitucional';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import VerificarCodigo from './pages/VerificarCodigo/VerificarCodigo';
import Login from './pages/Login/Login';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PainelInstitucional activeTab="painel" />} />
        <Route path="/painel" element={<PainelInstitucional activeTab="painel" />} />
        <Route path="/cadastrar-membro" element={<CadastrarMembro activeTab="cadastro" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;