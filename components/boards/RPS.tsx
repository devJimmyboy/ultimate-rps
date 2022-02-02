import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  CSSObject,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { motion, useAnimation, useAnimationFrame, useMotionValue } from "framer-motion"
import type { BoardProps } from "boardgame.io/react"
import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react"
import SplitPane from "react-split-pane"
import { RPSMove, RPSState } from "../../games/RPS"
import Move from "../three/Move"
import Rock from "../models/Rock"
import gsap from "gsap"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import ScaleOnHover from "../three/ScaleOnHover"
import ThreeLoader from "../three/ThreeLoader"
import RPSScene from "../three/RPSScene"
import * as THREE from "three"

export interface MyGameProps extends BoardProps<RPSState> {
  // Additional custom properties for your component
}

export function RPSBoard(props: MyGameProps) {
  const { ctx, G, moves, isActive, matchData, playerID } = props
  const [, setFrustumSize] = useState(25)
  let opponent = playerID === "0" ? "1" : "0"
  let winner: string | ReactElement = ""
  if (ctx.gameover) {
    winner = ctx.gameover.winner
  }
  const boxProps: BoxProps = {
    transition: "all ease-in-out",
    _hover: { scale: "1.2" },
    scale: "1",
    transform: "auto-gpu",
    cursor: "pointer",
  }
  const ready = G.playerInfo[playerID as string].ready
  // GSAP Animation
  const winText = useRef<HTMLDivElement>(null)
  const tl = useRef<GSAPTimeline>()
  useEffect(() => console.log("RPSState: ", matchData, ctx), [])
  useEffect(() => {
    if (ctx.gameover)
      tl.current = gsap
        .timeline({ repeat: -1, yoyo: true })
        .fromTo(winText.current, { scale: 1 }, { scale: 1.25, duration: 3, ease: "power2.inOut" })
  }, [ctx.gameover])
  useLayoutEffect(() => {
    if (ctx.gameover) gsap.fromTo(winText.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 })
  })
  if (ctx.phase === "setup")
    return (
      <Center w="100%" h="100vh">
        <HStack>
          {matchData &&
            matchData.map((player) => (
              <VStack key={`player${player.id}`} w="200px" h="250px">
                <Avatar name={`Player ${player.id}`} src={(matchData[player.id] as any).data?.avatarUrl || ""} />
                <Heading size="sm">{player.name}</Heading>
                <Heading as="h3" color="gray.50">
                  {G.playerInfo[player.id].ready ? "Ready" : "Not Ready"}
                </Heading>
              </VStack>
            ))}
        </HStack>
        <HStack pos="absolute" bottom="50" left="50%" transform="translate(-50%, -50%)">
          <Button
            colorScheme={ready ? "red" : "green"}
            onClick={() => moves.setReady(playerID, playerID ? !G.playerInfo[playerID].ready : false)}>
            {ready ? "Unready" : "Ready"}
          </Button>
          {playerID === "0" && <Button onClick={() => moves.startMatch()}>Start Game</Button>}
        </HStack>
      </Center>
    )

  if (ctx.gameover) {
    return (
      <Center h="100%" w="100%">
        <VStack gap={8} color="gray.50" filter="drop-shadow(6px 6px 2px #000)">
          <Heading fontSize={64} mb={42}>
            GAME OVER
          </Heading>
          <Text fontSize={28} fontWeight="semibold">
            THE WINNER IS
          </Text>
          <Box ref={winText} style={{ fontSize: "36px", fontWeight: 700, userSelect: "none" }}>
            {matchData?.find((p) => p.id.toString() === winner)?.name}
          </Box>
        </VStack>
      </Center>
    )
  } else {
    return (
      <Center w="100vw" h="100vh">
        <Canvas camera={{ zoom: 35 }} orthographic>
          <ambientLight intensity={2} />
          {/* <OrbitControls /> */}
          <Suspense fallback={<ThreeLoader />}>
            <RPSScene gameState={props} />
          </Suspense>
        </Canvas>
      </Center>
    )
  }
}

// <HStack align="center" justify="center" className="w-full h-full">
//   <Center w="50%" h="100vh">
//     <Stack direction="column" align="center" justify="center">
//       <Heading as="h2">You</Heading>
//       {ctx.activePlayers && ctx.activePlayers[playerID as string] === "choosing" && (
//         <Stack direction="row" gap={8}>
//           <Box {...boxProps} onClick={() => moves.Rock()}>
//             <Move type={RPSMove.ROCK} />
//           </Box>
//           <Box {...boxProps} onClick={() => moves.Paper()}>
//             <Move type={RPSMove.PAPER} />
//           </Box>
//           <Box {...boxProps} onClick={() => moves.Scissors()}>
//             <Move type={RPSMove.SCISSORS} />
//           </Box>
//         </Stack>
//       )}{" "}
//       {ctx.activePlayers && ctx.activePlayers[playerID as string] === "chosen" && (
//         <>
//           <Move type={G.players[playerID as string].chosenMove} />
//           <Button onClick={() => moves.nextTurn()}>Next Turn</Button>
//         </>
//       )}
//       <Heading as="h4">Score: {G.scores[playerID as string]}</Heading>
//     </Stack>
//   </Center>
//   <Center w="50%" h="100vh">
//     <Stack direction="column" gap={8} align="center" justify="center">
//       <Heading as="h2">Opponent {matchData?.find((i) => i.id === parseInt(opponent))?.name}</Heading>
//       {<Move type={G.players[opponent].chosenMove} />}
//       <Heading as="h4">Score: {G.scores[opponent]}</Heading>
//     </Stack>
//   </Center>
// </HStack>
