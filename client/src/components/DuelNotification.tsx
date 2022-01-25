import { Icon } from "@iconify/react"
import { Button } from "@mantine/core"
import React, { ReactElement } from "react"

interface Props {
  type: "sent" | "received"
  user: string
  onAccept?: () => void
  onDecline?: () => void
}

export default function DuelNotification({ type, user, onAccept, onDecline }: Props): ReactElement {
  if (type === "sent") return <>Awaiting {user}'s response...</>
  else
    return (
      <div className="flex flex-col gap-2 p-2">
        <h3>Duel Request from {user}!</h3>
        <div
          className="flex flex-row content-center"
          style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}>
          <Button onClick={onAccept} color="green" leftIcon={<Icon icon="mdi:check-bold" />}>
            Accept
          </Button>
          <Button onClick={onDecline} color="red" leftIcon={<Icon icon="mdi:close" />}>
            Decline
          </Button>
        </div>
      </div>
    )
}
