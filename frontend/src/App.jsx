import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PainelInstitucional from './pages/PainelInstitucional/PainelInstitucional';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import VerificarCodigo from './pages/VerificarCodigo/VerificarCodigo';
import Login from './pages/Login/Login';
import RequireAuth from './components/RequireAuth/RequireAuth';

const CADASTRO_DIRECTORATES = ['DIBIS', 'DIREX'];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <PainelInstitucional activeTab="painel" />
            </RequireAuth>
          }
        />
        <Route
          path="/painel"
          element={
            <RequireAuth>
              <PainelInstitucional activeTab="painel" />
            </RequireAuth>
          }
        />
        <Route
          path="/cadastrar-membro"
          element={
            <RequireAuth allowedDirectorates={CADASTRO_DIRECTORATES}>
              <CadastrarMembro activeTab="cadastro" />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;