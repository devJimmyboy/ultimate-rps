import { useEffect, useState } from 'react';
import { useAuth, useDatabase, useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { collection, doc, DocumentReference, getDoc, onSnapshot } from "firebase/firestore";

export interface UserData {
  username: string;
}

// // Custom hook to read  auth record and user profile doc
export function useUserData() {
  const db = useFirestore()
  const [userData, setUserData] = useState<UserData | null>(null)
  const { status, data: user } = useUser();
  useEffect(() => {
    if (!user) return
    const userDoc = doc(db, 'users', user.uid) as DocumentReference<UserData>
    getDoc(userDoc).then(userDoc => {
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    })
    const unsub = onSnapshot(userDoc, userDoc => {
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    })
    return () => unsub()
  }, [user])

  const statusFinal = status

  return { status: statusFinal, user, data: userData };
}
