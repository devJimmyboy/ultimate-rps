import { getAuth } from "firebase/auth" // Firebase v9+
import { getDatabase } from "firebase/database" // Firebase v9+
import { getFirestore } from "firebase/firestore"
import { PropsWithChildren, ReactElement, ReactNode } from "react"

import {
  FirebaseAppProvider,
  DatabaseProvider,
  AuthProvider,
  useFirebaseApp,
  useSigninCheck,
  FirestoreProvider,
} from "reactfire"
import Login from "../../components/Login"

export function FirebaseComponents({ children }: PropsWithChildren<{}>): ReactElement {
  const app = useFirebaseApp() // a parent component contains a `FirebaseAppProvider`

  // initialize Database and Auth with the normal Firebase SDK functions
  const firestore = getFirestore(app)
  const database = getDatabase(app)
  const auth = getAuth(app)

  // any child components will be able to use `useUser`, `useDatabaseObjectData`, etc
  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
      </DatabaseProvider>
    </AuthProvider>
  )
}

export function AuthCheck({ render, children }: PropsWithChildren<{ render: ReactElement | null }>): ReactElement {
  const { status, data: signInCheckResult } = useSigninCheck()

  if (status === "loading") {
    return render || <span>loading...</span>
  }

  if (signInCheckResult.signedIn === true) {
    return <>{children}</>
  } else {
    return <Login />
  }
}
