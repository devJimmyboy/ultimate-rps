import { Button, Center, Input, Spinner } from "@chakra-ui/react"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useUser } from "reactfire"
import HUD from "../components/HUD"
import DuelPage from "../components/DuelPage"
import styles from "../styles/App.module.css"

const Home: NextPage = () => {
  const { status, data: user } = useUser()

  useEffect(() => {
    if (status !== "loading") {
      // You know that the user is loaded: either logged in or out!
      console.log(user)
    }
  }, [status, user])

  if (status === "loading") {
    return (
      <div className={styles.App}>
        <Spinner colorScheme="twitter" />
      </div>
    )
  }

  return (
    <div className={styles.App}>
      <DuelPage />
      <HUD />
    </div>
  )
}

export default Home
