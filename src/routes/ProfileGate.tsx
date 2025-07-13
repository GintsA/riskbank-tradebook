import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { fetchProfileMeta } from '../services/profile';
import { Navigate, useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export default function ProfileGate({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const meta = await fetchProfileMeta(user.uid);
        setHasProfile(meta.hasProfile);
        setLoading(false);
        if (!meta.hasProfile) {
          navigate('/setup', { replace: true });
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!hasProfile) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}