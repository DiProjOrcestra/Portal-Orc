import { useState } from 'react';
import Header from '../../components/Header/Header';
import PainelInterno from '../../components/PainelInterno/PainelInterno';
import { PAINEL_INTERNO_ITEMS } from '../../components/PainelInterno/painelInternoItems';
import MissaoVisaoValores from './sections/MissaoVisaoValores';
import GoldenCircle from './sections/GoldenCircle';
import './PainelInstitucional.css';

export default function PainelInstitucional({ activeTab, onNavigate }) {
  const [activeSection, setActiveSection] = useState('mvv');

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
          {activeSection === 'golden-circle' ? <GoldenCircle /> : <MissaoVisaoValores />}
        </div>
      </main>
    </div>
  );
}
