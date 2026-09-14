import { useState } from 'react';
import PainelInstitucional from './pages/PainelInstitucional/PainelInstitucional';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';

function App() {
  const [page, setPage] = useState('painel');

  if (page === 'cadastro') {
    return <CadastrarMembro activeTab={page} onNavigate={setPage} />;
  }
  return <PainelInstitucional activeTab={page} onNavigate={setPage} />;
}

export default App;
