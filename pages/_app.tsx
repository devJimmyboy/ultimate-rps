import { AppProps } from "next/app"

import "../styles/globals.css"
import { ChakraProvider, extendTheme, cookieStorageManager, Center, Spinner, Text } from "@chakra-ui/react"
import { PageTransition } from "next-page-transitions"
import { AppHead } from "../components/AppHead"
import Background from "../components/Background"
import { Toaster } from "react-hot-toast"
import { FirebaseAppProvider, useAuth, useUser } from "reactfire"
import { FirebaseComponents } from "../lib/firebase/FirebaseComponents"
import { PropsWithChildren, ReactElement, useEffect } from "react"
import { signInAnonymously } from "firebase/auth"
import theme from "../lib/theme"
import { useLoader } from "@react-three/fiber"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
useLoader.preload(FontLoader, "/LilitaOne.json")

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
import Loader from "../components/Loader"
const TIMEOUT = 400

export default function App(props: AppProps) {
  const { Component, pageProps, router } = props

  return (
    <>
      <AppHead />
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirebaseComponents>
          <ChakraProvider colorModeManager={cookieStorageManager("colorMode")} resetCSS theme={theme}>
            <Background />
            <VerifyUser>
              <PageTransition
                timeout={TIMEOUT}
                classNames="page-transition"
                loadingComponent={<Loader show={true} />}
                loadingDelay={500}
                loadingTimeout={{
                  enter: TIMEOUT,
                  exit: 0,
                }}
                loadingClassNames="loading-indicator">
                <Component {...pageProps} key={router.route} />
              </PageTransition>
              <Toaster />
            </VerifyUser>
          </ChakraProvider>
        </FirebaseComponents>
      </FirebaseAppProvider>
      <style jsx global>{`
        .page-transition-enter {
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .page-transition-enter-active {
          width: 100%;
          height: 100%;
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }
        .page-transition-enter-done {
          width: 100%;
          height: 100%;
        }
        .page-transition-exit-done {
          width: 100%;
          height: 100%;
        }
        .page-transition-exit {
          width: 100%;
          height: 100%;
          opacity: 1;
        }
        .page-transition-exit-active {
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }
        .loading-indicator-appear,
        .loading-indicator-enter {
          opacity: 0;
        }
        .loading-indicator-appear-active,
        .loading-indicator-enter-active {
          opacity: 1;
          transition: opacity ${TIMEOUT}ms;
        }
      `}</style>
    </>
  )
}

function VerifyUser({ children }: PropsWithChildren<{}>): ReactElement {
  const { status, data: user } = useUser()
  const auth = useAuth()

  useEffect(() => {
    if (status !== "loading" && !user) {
      // signInAnonymously(auth)
    }
  }, [status, user])

  if (status === "loading") {
    return (
      <Center w="100%" h="100%">
        <Spinner label="Loading..." />
      </Center>
    )
  }

  return <>{children}</>
}
