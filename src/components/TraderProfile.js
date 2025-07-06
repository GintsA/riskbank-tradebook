import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function TraderProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      loadProfile(user.uid);
    }
  }, [user]);

  const loadProfile = async (uid) => {
    const ref = doc(db, 'traderProfiles', uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      setProfile(docSnap.data());
    } else {
      // If no profile exists, create default
      const defaultProfile = {
        username: user.email,
        experienceLevel: "Beginner",
        performance: {
          winRate: 0.5,
          tradesCompleted: 0,
        },
        bags: {
          riskBag: 0,
          safeAccountBag: 0,
          takeHomeBag: 0,
        }
      };
      await setDoc(ref, defaultProfile);
      setProfile(defaultProfile);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Trader Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Experience Level:</strong> {profile.experienceLevel}</p>
      <p><strong>Win Rate:</strong> {profile.performance.winRate}</p>
      <p><strong>Trades Completed:</strong> {profile.performance.tradesCompleted}</p>
    </div>
  );
}

export default TraderProfile;
