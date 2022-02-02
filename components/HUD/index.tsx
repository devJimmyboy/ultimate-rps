import { Icon } from "@iconify/react"
import { Box, Text, Stack, Button, Code, useClipboard, Spacer } from "@chakra-ui/react"
import React, { ReactElement, useEffect, useState } from "react"
// import DuelNotification from "./DuelNotification"
// import SocialDropdown from "../social/SocialDropdown"
import { signOut } from "firebase/auth"
import { useAuth, useUser } from "reactfire"
import UserDetails from "./UserDetails"

interface Props {}

export default function HUD({}: Props): ReactElement {
  const auth = useAuth()
  const { data: user, status } = useUser()
  return (
    <Stack
      direction="row"
      align="end"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        pointerEvents: "none",
        "& > *": { pointerEvents: "all" },
        padding: "6px 0.5em",
      }}>
      <UserDetails />
      {/* <Text
        component="div"
        sx={{
          left: 0,
          bottom: 0,
          cursor: "default",
          "&:hover > .user-id": { fontWeight: "700", color: "cyan.600" },
        }}>
        Logged In as:{" "}
        <Code
          className="user-id"
          bg="gray.400"
          fontWeight="semibold"
          onClick={() => user?.uid && useClipboard(user?.uid)}
          sx={{ cursor: "pointer" }}>
          {user?.displayName || "Anonymous"}
        </Code>
      </Text> */}
      <Spacer pointerEvents="none" />
      {user?.uid && user.uid.length > 0 && (
        <Button
          styles={{ root: { paddingLeft: "0.5em" }, leftIcon: { marginRight: "0.5em" } }}
          leftIcon={<Icon fontSize={20} style={{ margin: 0 }} icon="mdi:logout" />}
          variant="filled"
          onClick={(e) => {
            signOut(auth)
          }}>
          Logout
        </Button>
      )}
      <Button
        styles={{ root: { paddingLeft: "0.5em" }, leftIcon: { marginRight: "0.5em" } }}
        leftIcon={<Icon fontSize={20} style={{ margin: 0 }} icon="mdi:login" />}
        variant="solid"
        onClick={(e) => {
          window.location.href = "/login"
        }}>
        Login
      </Button>
    </Stack>
  )
}
