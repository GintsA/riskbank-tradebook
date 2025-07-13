import { doc, getDoc, setDoc, runTransaction, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RiskInput, RiskComputed } from '../utils/riskMath';

export interface TraderProfile extends RiskInput, RiskComputed {}

export async function fetchProfileMeta(uid: string): Promise<{ hasProfile: boolean }> {
  // Store profile metadata in a top level collection. Using a collection with
  // two path segments avoids Firestore's "invalid document reference" errors
  // that occur when an odd number of path segments is used with `doc()`.
  const ref = doc(db, 'traderProfilesMeta', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as { hasProfile: boolean }) : { hasProfile: false };
}

export async function saveProfile(uid: string, profile: TraderProfile): Promise<void> {
  // Profiles themselves are saved in the `traderProfiles` collection, keyed by
  // user UID. A separate `traderProfilesMeta` document tracks the existence of
  // a profile for quick lookups.
  const profileRef = doc(db, 'traderProfiles', uid);
  const metaRef = doc(db, 'traderProfilesMeta', uid);
  await setDoc(profileRef, profile);
  await setDoc(metaRef, { hasProfile: true }, { merge: true });
}

export async function resetProfile(uid: string): Promise<void> {
  // Profiles themselves are saved in the `traderProfiles` collection, keyed by
  // user UID. A separate `traderProfilesMeta` document tracks the existence of
  // a profile for quick lookups.
  const profileRef = doc(db, 'traderProfiles', uid);
  const metaRef = doc(db, 'traderProfilesMeta', uid);
  await runTransaction(db, async (tx) => {
    tx.delete(profileRef);
    tx.set(metaRef, { hasProfile: false }, { merge: true });
  });
}