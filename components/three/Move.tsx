import * as THREE from "three"
import React from "react"
import { RPSMove } from "../../games/RPS"
import Rock from "../models/Rock"
import ThreeLoader from "./ThreeLoader"
import { useFrame } from "@react-three/fiber"
import Scissors from "../models/Scissors"

type Props = {
  moveType: RPSMove
}

export default function Move({ moveType, ...props }: JSX.IntrinsicElements["group"] & Props) {
  const mesh = React.useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.getElapsedTime() / 2
  })
  switch (moveType) {
    case RPSMove.ROCK:
      return <Rock ref={mesh} {...props} />
    case RPSMove.PAPER:
      return <Rock ref={mesh} {...props} />
    case RPSMove.SCISSORS:
      return <Scissors ref={mesh} {...props} />
    default:
      return <ThreeLoader />
  }
}
