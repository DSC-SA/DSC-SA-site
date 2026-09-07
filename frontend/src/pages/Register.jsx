import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Registration is handled exclusively through Google Sign-In (there is no
// email/password account system). Visiting /register simply sends the user to
// the sign-in page, where "Continue with Google" creates/signs them in.
export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
