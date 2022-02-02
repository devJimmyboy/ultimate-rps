import React from "react"
import { Environment } from "@react-three/drei"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { MyGameProps } from "../boards/RPS"
import ScaleOnHover from "./ScaleOnHover"
import Move from "./Move"
import { RPSMove } from "../../games/RPS"
import { useLoader } from "@react-three/fiber"
import TextMesh from "./TextMesh"

interface Props {
  gameState: MyGameProps
}

export default function RPSScene({ gameState }: Props) {
  const { playerID, matchData, moves, G, ctx } = gameState
  const lilitaFont = useLoader(FontLoader, "/LilitaOne.json")
  const txtcfg = {
    font: lilitaFont,
    color: "#2244A2",
    size: 0.75,
    height: 0.25,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.01,
  }
  return (
    <group position={[-15, 0, 0]}>
      <TextMesh {...txtcfg}>{(matchData && matchData[1 - parseInt(playerID as string)].name) || "Player 1"}</TextMesh>
      <ScaleOnHover position={[-4, 0, 0]}>
        <Move moveType={RPSMove.ROCK} onClick={() => moves.Rock()} />
      </ScaleOnHover>
      <ScaleOnHover>
        <Move moveType={RPSMove.PAPER} onClick={() => moves.Paper()} />
      </ScaleOnHover>
      <ScaleOnHover position={[4, 0, 0]}>
        <Move moveType={RPSMove.SCISSORS} onClick={() => moves.Scissors()} />
      </ScaleOnHover>
      <Environment preset="park" />
    </group>
  )
}
