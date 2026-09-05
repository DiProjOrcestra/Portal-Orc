import { useState } from 'react';
import Header from '../../components/Header/Header';
import PainelInterno from '../../components/PainelInterno/PainelInterno';
import PlanejamentoEstrategico from './sections/PlanejamentoEstrategico';
import './PainelInstitucional.css';

export default function PainelInstitucional({ activeTab, onNavigate }) {
  const [activeSection, setActiveSection] = useState('planejamento');

  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <Header active={activeTab} onNavigate={onNavigate} />
      <main className="painel-institucional">
        <PainelInterno active={activeSection} onSelect={setActiveSection} />
        <div className="painel-institucional__content">
          <PlanejamentoEstrategico />
        </div>
      </main>
    </div>
  );
}
