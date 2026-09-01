import Header from '../../components/Header/Header';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './CadastrarMembro.css';

export default function CadastrarMembro() {
  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <Header />
      <main className="page__main">
        <RegisterForm />
      </main>
    </div>
  );
}
