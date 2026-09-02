import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastrarMembro from './pages/CadastrarMembro/CadastrarMembro';
import Login from './pages/Login/Login';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastrar-membro" element={<CadastrarMembro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;