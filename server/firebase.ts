import fbAdmin, { ServiceAccount } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { Firestore } from "bgio-firebase";
import serviceAccount from "../secrets/serviceAccountKey.json"


initializeApp({ credential: fbAdmin.credential.cert(serviceAccount as ServiceAccount), databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL });

export const db = new Firestore({
  config: {
    credential: fbAdmin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  }
})