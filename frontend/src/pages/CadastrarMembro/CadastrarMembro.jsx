import Header from '../../components/Header/Header';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './CadastrarMembro.css';

export default function CadastrarMembro({ activeTab, onNavigate }) {
  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <Header active={activeTab} onNavigate={onNavigate} />
      <main className="page__main">
        <RegisterForm />
      </main>
    </div>
  );
}
