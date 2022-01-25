import { Title } from "@mantine/core"
import React, { ReactElement } from "react"
import { useSpring, animated } from "react-spring"
import { useDrag } from "react-use-gesture"

const AnimTitle = animated(Title)
interface Props {}

export default function PageTitle({}: Props): ReactElement {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0, config: { mass: 15, tension: 200, friction: 50 } }))

  const bind = useDrag(({ active, movement: [x, y] }) =>
    api.start({
      x: active ? x : 0,
      y: active ? y : 0,
      immediate: (name) => active && (name === "x" || name === "y"),
    })
  )
  return (
    <AnimTitle
      {...bind()}
      style={{
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
        filter: "drop-shadow(5px 10px 2px rgba(0, 0, 0, 0.9))",
        x,
        y,
      }}
      order={1}
      sx={(theme) => ({ justifySelf: "start", color: theme.colors.gray[2], fontSize: "5rem" })}>
      Ultimate RPS
    </AnimTitle>
  )
}
