import LoginForm from '../../components/LoginForm/LoginForm';
import './Login.css';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-page__background" aria-hidden="true" />
      <main className="login-page__main">
        <LoginForm />
      </main>
    </div>
  );
}