import { useState } from 'react';
import PainelInstitucional from './pages/PainelInstitucional/PainelInstitucional';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import VerificarCodigo from './pages/VerificarCodigo/VerificarCodigo';

function App() {
  const [page, setPage] = useState('painel');

  if (page === 'cadastro') {
    return <CadastrarMembro activeTab={page} onNavigate={setPage} />;
  }
  return <PainelInstitucional activeTab={page} onNavigate={setPage} />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastrar-membro" element={<CadastrarMembro />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
