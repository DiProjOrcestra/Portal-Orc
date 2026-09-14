import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PainelInstitucional from './pages/PainelInstitucional/PainelInstitucional';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import Login from './pages/Login/Login';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastrar-membro" element={<CadastrarMembro />} />
        <Route path="/login" element={<Login />} />
        <Route path="painel" element={<PainelInstitucional />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
