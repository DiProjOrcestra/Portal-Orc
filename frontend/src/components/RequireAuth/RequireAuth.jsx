import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

// Gate for routes that require a logged-in session. Backend has no way to
// tell the client whether access_token is set (httpOnly), so this checks by
// calling GET /v1/auth/me: 200 means the cookie is valid, 401 means it's
// missing/expired - either way redirects instead of leaking the page's
// content or its data-fetch errors.
//
// allowedDirectorates optionally restricts the route further to specific
// diretorias (e.g. cadastro de membro is DIBIS/DIREX only) - pass a
// module-level constant, not an inline array, so its reference is stable
// across renders and doesn't re-trigger the effect.
export default function RequireAuth({ children, allowedDirectorates }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((data) => {
        if (!mounted) return;
        if (allowedDirectorates && !allowedDirectorates.includes(data.directorate)) {
          setStatus('forbidden');
        } else {
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (mounted) setStatus('unauthenticated');
      });

    return () => {
      mounted = false;
    };
  }, [allowedDirectorates]);

  if (status === 'checking') return null;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  if (status === 'forbidden') return <Navigate to="/painel" replace />;

  return children;
}
