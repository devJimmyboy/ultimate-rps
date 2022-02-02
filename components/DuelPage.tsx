import { Icon } from "@iconify/react"
import {
  Center,
  Stack,
  Text,
  Spacer,
  Input,
  IconButton,
  Button,
  InputGroup,
  InputRightElement,
  Box,
  VStack,
  HStack,
  Heading,
  useInterval,
  useColorModeValue,
  Image,
} from "@chakra-ui/react"
import { FixedSizeList as List, ListChildComponentProps } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { useBoolean } from "react-use"
import { debounce } from "lodash"
import React, { forwardRef, ReactElement, useCallback, useEffect, useState } from "react"
import PageTitle from "./PageTitle"
import { LobbyClient } from "boardgame.io/client"
import { LobbyAPI } from "boardgame.io"
import { useRouter } from "next/router"
import { doc, getDoc } from "firebase/firestore"
import { useFirestore, useFirestoreDocData, useUser } from "reactfire"
import { useUserData } from "../lib/hooks"

interface Props {}
const lobbyClient = new LobbyClient()
export default function DuelPage({}: Props): ReactElement {
  const firestore = useFirestore()
  const [loading, setLoading] = useBoolean(false)
  const [validUser, setValidUser] = useState(true)
  const [toDuel, setToDuel] = useState("")
  const { status, user, data: userData } = useUserData()

  const router = useRouter()

  const [matches, setMatches] = useState<LobbyAPI.Match[]>([])

  const getInfo = useCallback(async () => {
    const { matches } = await lobbyClient.listMatches("ultimate-rps", {
      isGameover: false,
      updatedAfter: Date.now() - 1000 * 60 * 60,
    })
    setMatches(matches)
  }, [setMatches])

  useEffect(() => {
    getInfo()
  }, [])

  useInterval(getInfo, 10000)

  const joinMatch = useCallback(
    async (matchID: string) => {
      if (!user) return
      lobbyClient
        .joinMatch(
          "ultimate-rps",
          matchID,
          {
            playerName: userData?.username || user.displayName || "Anonymous",
            data: { avatarUrl: user.photoURL || "", uid: user.uid },
          },
          { headers: { Authentication: await user.getIdToken() } }
        )
        .then((creds) => router.push({ pathname: `/duel/${matchID}`, query: { id: creds.playerID } }))
    },
    [user, userData, router]
  )

  const createMatch = useCallback(async () => {
    if (!user) return
    const { matchID } = await lobbyClient.createMatch(
      "ultimate-rps",
      {
        numPlayers: 2,
      },
      { headers: { Authentication: await user.getIdToken() } }
    )

    joinMatch(matchID)
  }, [user, joinMatch])

  const validateUser = debounce(async (val) => {
    const userDoc = await getDoc(doc(firestore, "usernames", val))
    setValidUser(userDoc.exists())

    setLoading(false)
  }, 500)
  const checkUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length < 3) return
    // console.log(e.currentTarget.value)
    setToDuel(e.currentTarget.value)

    setLoading(true)
    const matchEntered = matches.find((m) => m.matchID === e.currentTarget.value)
    if (matchEntered) {
      setLoading(false)
      setValidUser(true)
    } else validateUser(e.currentTarget.value)
  }
  return (
    <Center className="w-full h-full" sx={{ zIndex: 2 }}>
      <Box
        pos="absolute"
        bg="bg"
        roundedLeft="lg"
        shadow="inner"
        right={0}
        top="50%"
        transform="auto-gpu"
        translateY="-50%"
        overflowY="auto"
        w="300px"
        minH="250px"
        maxH="400px"
        zIndex="banner">
        <VStack p={2}>
          <Heading size="md" mb={2}>
            Current Matches:
          </Heading>
          <List
            height={325}
            width="100%"
            itemCount={matches.length}
            // innerElementType={Row}
            itemData={matches.map((m) => ({ ...m, join: () => joinMatch(m.matchID) }))}
            itemSize={60}>
            {MatchView}
          </List>
        </VStack>
      </Box>
      <Stack direction="column" justify="center" style={{ height: "50%" }} align="center">
        <PageTitle />
        <Spacer style={{ flexGrow: 1 }} />
        <InputGroup size="lg">
          <Input
            pr="108px"
            style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
            type="text"
            bg="gray.800"
            color="gray.50"
            spellCheck="false"
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            radius="sm"
            // error={!validUser}
            onChange={(e) => checkUser(e)}
            placeholder="Enter an ID to Duel..."
          />
          <InputRightElement p={1} w="108px">
            <Button
              disabled={!validUser}
              isLoading={loading}
              h="100%"
              style={{
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
              }}
              bgGradient="linear(to-r, indigo, cyan)"
              _hover={{
                bgGradient: "linear(to-r, red.500, yellow.500)",
              }}
              leftIcon={<Icon icon="mdi:sword-cross" />}
              variant="outline"
              onClick={(e) => joinMatch(toDuel)}>
              Duel!
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button onClick={createMatch} alignSelf="end">
          Create Lobby
        </Button>
        <Spacer style={{ flexGrow: 1 }} />
      </Stack>
    </Center>
  )
}

interface MatchViewProps extends ListChildComponentProps<(LobbyAPI.Match & { join: () => void })[]> {}

function MatchView(props: MatchViewProps): ReactElement {
  const { data, index, style } = props
  const match = data[index]
  return (
    <HStack
      style={{
        ...style,
        top: `${parseFloat(style.top as string) + 4 * index}px`,
        transform: style.transform,
      }}
      onClick={match.join}
      _hover={{ transform: style.transform + " translateY(-10px)", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.6)" }}
      transition="all 0.2s ease-in-out"
      bg={useColorModeValue("gray.100", "gray.700")}
      p={1}
      w="full"
      h="100%"
      rounded="lg">
      {match.players?.[0].data?.avatarUrl ? (
        <Image h="100%" rounded="full" alt={"Lobby Owner Img"} src={match.players[0].data.avatarUrl} />
      ) : (
        <Icon icon="mdi:sword-cross" color="white" height="100%" width="50px" />
      )}
      <VStack align="start">
        <Text>{match.matchID}</Text>
        <Text>{match.players.map((p) => p.name || "OPEN").join(", ")}</Text>
      </VStack>
    </HStack>
  )
}
