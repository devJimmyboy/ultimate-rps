import { Icon } from "@iconify/react"
import { Center, Group, Title, Space, TextInput, ActionIcon, Button } from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import { debounce } from "lodash"
import React, { ReactElement, useEffect, useState } from "react"
import PageTitle from "./PageTitle"

interface Props {}

export default function DuelPage({}: Props): ReactElement {
  const [loading, setLoading] = useBooleanToggle(false)
  const [validUser, setValidUser] = useState(true)
  const [toDuel, setToDuel] = useState("")
  const validateUser = debounce(
    (val) =>
      sock.emit("user:check", val, (v) => {
        setValidUser(v)
        setLoading(false)
        // console.log(v)
      }),
    500
  )
  const checkUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length < 3) return
    // console.log(e.currentTarget.value)

    setToDuel(e.currentTarget.value)
    setLoading(true)
    validateUser(e.currentTarget.value)
  }
  const connect = () => {
    sock.emit("duel:req", toDuel)
    setLoading(true)
  }

  useEffect(() => {
    sock.on("duel:accept", (from) => {
      setLoading(false)
      console.log(`${from} accepted your duel request!`)
    })
  })
  return (
    <Center className="w-full h-full" sx={(theme) => ({ zIndex: 2 })}>
      <Group direction="column" position="center" style={{ height: "50%" }} align="center">
        <PageTitle />
        <Space style={{ flexGrow: 1 }} />
        <TextInput
          style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
          type="text"
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
          radius="sm"
          size="lg"
          error={!validUser}
          onChange={(e) => checkUser(e)}
          placeholder="Enter an ID to Duel..."
          rightSection={
            <Button
              disabled={!validUser}
              style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)" }}
              leftIcon={<Icon icon="mdi:sword-cross" />}
              loading={loading}
              onClick={connect}
              variant="gradient"
              gradient={loading ? { from: "gray", to: "white" } : { from: "indigo", to: "cyan" }}>
              Duel!
            </Button>
          }
          rightSectionWidth={108}
        />
        <Space style={{ flexGrow: 1 }} />
      </Group>
    </Center>
  )
}
