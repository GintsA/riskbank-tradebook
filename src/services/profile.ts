import { doc, getDoc, setDoc, runTransaction, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RiskInput, RiskComputed } from '../utils/riskMath';

export interface TraderProfile extends RiskInput, RiskComputed {}

export async function fetchProfileMeta(uid: string): Promise<{ hasProfile: boolean }> {
  const ref = doc(db, 'traders', uid, 'profileMeta');
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as { hasProfile: boolean }) : { hasProfile: false };
}

export async function saveProfile(uid: string, profile: TraderProfile): Promise<void> {
  const profileRef = doc(db, 'traders', uid, 'profile');
  const metaRef = doc(db, 'traders', uid, 'profileMeta');
  await setDoc(profileRef, profile);
  await setDoc(metaRef, { hasProfile: true }, { merge: true });
}

export async function resetProfile(uid: string): Promise<void> {
  const profileRef = doc(db, 'traders', uid, 'profile');
  const metaRef = doc(db, 'traders', uid, 'profileMeta');
  await runTransaction(db, async (tx) => {
    tx.delete(profileRef);
    tx.set(metaRef, { hasProfile: false }, { merge: true });
  });
}