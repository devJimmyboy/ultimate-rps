import { Icon } from "@iconify/react"
import { Center, Divider, Group, Paper } from "@mantine/core"
import React, { ReactElement, useEffect, useState } from "react"
import { animated, useSpring } from "react-spring"
import { useStore } from "../../lib/useStore"
import DuelNotification from "../DuelNotification"

const APaper = animated(Paper)
interface Props {}

let callback = (res) => {
  console.log("No Callback")
}
export default function SocialDropdown({}: Props): ReactElement {
  const [user, setUser] = useStore((state) => [state.user, state.updateUser])
  const [duelReq, setDuelReq] = useState({ active: false, from: "" })
  const [connected, setConnected] = useState(sock.connected)
  const [res, setRes] = useState<boolean>(null)

  useEffect(() => {
    sock.on("connect", () => {
      setConnected(true)
    })
    sock.on("disconnect", () => {
      setConnected(false)
    })
    sock.on("duel:req", (from, cb) => {
      setDuelReq({ active: true, from })

      callback = cb
      // setCallback((res: boolean) => cb(res))
    })
  }, [])

  useEffect(() => {
    if (res === null) return
    callback(res)
    setRes(null)
  }, [res])

  const { y } = useSpring({ y: duelReq.active ? 0 : -128 })
  return (
    <animated.div
      className="top-0 left-4 rounded-t-none  flex flex-col content-evenly"
      style={{ position: "fixed", translateY: y, width: "250px", height: "175px" }}>
      <Paper className="h-full rounded-b-lg rounded-t-none rounded-bl-none">
        <div className="container">
          <DuelNotification
            user={duelReq.from}
            type="received"
            onAccept={() => {
              setRes(true)
              setDuelReq((req) => {
                req.active = false
                return req
              })
            }}
            onDecline={() => {
              setRes(false)
              setDuelReq((req) => {
                req.active = false
                return req
              })
            }}
          />
        </div>
      </Paper>
      <Paper className="w-32 px-1 py-2 h-18 justify-self-end gap-2 rounded-t-none rounded-b-xl shadow-md">
        <div className="flex flex-row justify-center items-center m-2 gap-1">
          <svg className={connected ? "" : "animate-pulse"} style={{}} width="20" height="20">
            <circle cx="50%" cy="50%" r="10" fill={connected ? "green" : "red"} />
          </svg>
          <Divider orientation="vertical" size="lg" />
          <Center className="font-semibold text-2xl h-5" style={{ lineHeight: "20px" }}>
            {connected ? "Online" : "Disconnected"}
          </Center>
        </div>
      </Paper>
    </animated.div>
  )
}
