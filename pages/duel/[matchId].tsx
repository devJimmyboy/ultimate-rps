import type { NextPage } from "next"
import { Client, Lobby } from "boardgame.io/react"
import { RPS } from "../../games/RPS"
import { RPSBoard } from "../../components/boards/RPS"
import { SocketIO } from "boardgame.io/multiplayer"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Box, Center, HStack, Spinner, Text } from "@chakra-ui/react"
import { useUser } from "reactfire"

const App = Client({
  game: RPS,
  board: RPSBoard,
  multiplayer: SocketIO(),
  loading: () => (
    <HStack h="100%" w="100%" gap={8} justify="center">
      <Spinner color="blue.400" size="xl" thickness="4px" label="Connecting..." />{" "}
      <Text fontSize={32} fontWeight={700} color="gray.50">
        Connecting...
      </Text>
    </HStack>
  ),
})

const Match: NextPage = (props) => {
  const { status, data: user } = useUser()
  const [token, setToken] = useState("")
  const router = useRouter()
  const { id: playerId, matchId } = router.query as { id: string; matchId: string }

  useEffect(() => {
    if (status !== "loading" && !user) {
      // router.push("/login")
    }
    if (user)
      user?.getIdToken().then(
        (tok) => setToken(tok),
        () => setToken("none")
      )
  }, [status, user])
  useEffect(() => {}, [])
  if (status === "loading" || token === "") {
    return <Center>loading...</Center>
  }

  if (token === "none") {
    return (
      <Center w="100%" h="100%">
        Rejected, unable to retrieve token
      </Center>
    )
  }
  // return (
  //   <Box bg="white" rounded="lg">
  //     <Lobby gameComponents={[{ game: RPS, board: RPSBoard }]} />
  //   </Box>
  // )
  return (
    <Center w="100%" h="100%">
      <App playerID={playerId} matchID={matchId} credentials={token} />
    </Center>
  )
}

export default Match
