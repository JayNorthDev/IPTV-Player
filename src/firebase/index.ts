'use client';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { app } from './config';

export function getFirebase() {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { auth, firestore };
}
