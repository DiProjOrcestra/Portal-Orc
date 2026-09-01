import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import VerificarCodigo from './pages/VerificarCodigo/VerificarCodigo';

function App() {
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
