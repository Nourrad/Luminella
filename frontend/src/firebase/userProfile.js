// userProfile.js
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';  // adjust if needed
import { getAuth } from 'firebase/auth';

export const saveUserProfile = async ({ name, email, skinType, concerns, profileImageURL }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    name,
    email,
    skinType,
    concerns,
    profileImageURL: profileImageURL || ''
  }, { merge: true });  // merge = keep existing fields
};

export const getUserProfile = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    return null;
  }
};
