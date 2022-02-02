import { Box, Heading, LightMode, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore"
import { Router, useRouter } from "next/router"
import React, { ReactElement } from "react"
import { useAuth } from "reactfire"
import { Card } from "./Card"
import { EmailLoginForm } from "./EmailLoginForm"
import { GoogleLoginButton } from "./GoogleLoginButton"
import { Logo } from "./Logo"

interface LoginProps {}

const signOut = (auth: Auth) => auth.signOut().then(() => console.log("signed out"))
const signInGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider()
  const firestore = getFirestore(auth.app)

  await signInWithPopup(auth, provider).then(async (result) => {
    const { user } = result
    const uDoc = doc(firestore, "users", user.uid)
    await getDoc(uDoc).then((doc) => {
      if (!doc.exists()) {
        setDoc(uDoc, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          username: null,
          created: serverTimestamp(),
        })
      }
    })
  })
}

const signIn = async (auth: Auth, data: { email: string; password: string; username?: string }) => {
  const firestore = getFirestore(auth.app)
  const { email, password, username } = data

  await signInWithEmailAndPassword(auth, email, password).catch((err) => {
    if (err.code === "auth/user-not-found") {
      createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
        const { user } = result
        const uDoc = doc(firestore, "users", user.uid)
        await getDoc(uDoc).then((doc) => {
          setDoc(uDoc, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            username: username || null,
            created: serverTimestamp(),
          })
        })
      })
    }
  })
}

const Login = (): ReactElement => {
  const auth = useAuth()
  const router = useRouter()
  return (
    <Card maxW="2xl" mx="auto" textAlign="center">
      <Stack maxW="xs" mx="auto" spacing="8">
        <Stack spacing="3">
          <Heading as="h1" letterSpacing="tight">
            Login to Ultimate RPS
          </Heading>
          {/* <Text fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
            Create an account and get 20% discount
          </Text> */}
        </Stack>

        <LightMode>
          <GoogleLoginButton
            onClick={() =>
              signInGoogle(auth).then(() => {
                router.push("/")
              })
            }
          />
        </LightMode>
        <EmailLoginForm
          onDone={(data, e) => {
            if (e) e.preventDefault()
            signIn(auth, data)
          }}
        />

        <Box fontSize="sm">
          <Text fontWeight="medium" color={useColorModeValue("gray.600", "gray.400")}>
            Already have an account?
          </Text>
          <Link fontWeight="semibold" color={useColorModeValue("teal.600", "teal.300")}>
            Log back in
          </Link>
        </Box>
      </Stack>
      <Text mt="16" fontSize="xs" mx="auto" maxW="md" color={useColorModeValue("gray.600", "gray.400")}>
        By continuing, you acknowledge that you have read, understood, and agree to our terms and condition
      </Text>
    </Card>
  )
}

export default Login
