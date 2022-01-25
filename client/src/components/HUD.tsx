import { Icon } from "@iconify/react"
import { Anchor, Box, Text, Group, Button, Code } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { useNotifications } from "@mantine/notifications"
import React, { ReactElement, useEffect, useState } from "react"
import { useStore } from "../lib/useStore"
import DuelNotification from "./DuelNotification"
import SocialDropdown from "./social/SocialDropdown"

interface Props {}

export default function HUD({}: Props): ReactElement {
  const [user, setUser] = useStore((state) => [state.user, state.updateUser])
  useEffect(() => {
    sock.emit("user:getInfo", (user) => {
      setUser(user)
    })
  }, [])
  const { copy, copied } = useClipboard()
  return (
    <Box<typeof Group>
      component={Group}
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
      <SocialDropdown />
      <Text
        component="div"
        sx={{
          left: 0,
          bottom: 0,
          cursor: "default",
          "&:hover > .user-id": { fontWeight: "700", color: "cyan" },
        }}>
        Logged In as:{" "}
        <Code className="user-id" onClick={() => copy(user.uid)} sx={{ cursor: "pointer" }}>
          {user.uid}
        </Code>
      </Text>
      <div style={{ flexGrow: 1 }} />
      {user.uid.length > 0 && (
        <Button
          styles={{ root: { paddingLeft: "0.5em" }, leftIcon: { marginRight: "0.5em" } }}
          leftIcon={<Icon fontSize={20} style={{ margin: 0 }} icon="mdi:logout" />}
          variant="gradient"
          gradient={{ from: "violet", to: "indigo" }}
          onClick={(e) => {
            fetch("/logout", { method: "POST" }).then()
          }}>
          Logout
        </Button>
      )}
      <Button
        styles={{ root: { paddingLeft: "0.5em" }, leftIcon: { marginRight: "0.5em" } }}
        leftIcon={<Icon fontSize={20} style={{ margin: 0 }} icon="mdi:twitch" />}
        variant="gradient"
        gradient={{ from: "violet", to: "indigo" }}
        onClick={(e) => {
          window.location.href = "/auth/twitch"
        }}>
        Login w/ Twitch
      </Button>
    </Box>
  )
}
