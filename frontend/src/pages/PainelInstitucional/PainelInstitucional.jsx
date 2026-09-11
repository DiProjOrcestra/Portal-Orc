import { useState } from 'react';
import Header from '../../components/Header/Header';
import PainelInterno from '../../components/PainelInterno/PainelInterno';
import { PAINEL_INTERNO_ITEMS } from '../../components/PainelInterno/painelInternoItems';
import MissaoVisaoValores from './sections/MissaoVisaoValores';
import GoldenCircle from './sections/GoldenCircle';
import PlanejamentoEstrategico from './sections/PlanejamentoEstrategico';
import './PainelInstitucional.css';

const SECTIONS = {
  'golden-circle': GoldenCircle,
  planejamento: PlanejamentoEstrategico,
};

export default function PainelInstitucional({ activeTab, onNavigate }) {
  const [activeSection, setActiveSection] = useState('mvv');
  const Section = SECTIONS[activeSection] ?? MissaoVisaoValores;

  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <Header
        active={activeTab}
        onNavigate={onNavigate}
        sections={PAINEL_INTERNO_ITEMS}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />
      <main className="painel-institucional">
        <PainelInterno active={activeSection} onSelect={setActiveSection} />
        <div className="painel-institucional__content">
          <Section />
        </div>
      </main>
    </div>
  );
}
