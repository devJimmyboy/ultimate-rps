import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { doc, getDoc, writeBatch } from "firebase/firestore"
import { debounce } from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { useBoolean } from "react-use"
import { useFirestore, useUser } from "reactfire"

type Props = {}

export default function UserDetails({}: Props) {
  const { status, data: user } = useUser()
  return (
    <Box pos="absolute" top={2} left={2} rounded="lg" boxShadow="inner" p={4} minW="14em" maxW="20em" h="6em" bg="bg">
      {status !== "loading" ? (
        <Stack h="100%" w="100%" direction="row" align="center">
          <Avatar size="lg" src={user?.photoURL || ""} name={user ? user.displayName || "Anonymous" : "Guest"} />
          <VStack px={2} align="start">
            <Text fontWeight={700}>{user ? user.displayName || "Anonymous" : "Guest"}</Text>
            <UsernameForm />
          </VStack>
        </Stack>
      ) : (
        <Stack>
          <Spinner label="Loading User..." />
        </Stack>
      )}
    </Box>
  )
}

// Username form
function UsernameForm() {
  const firestore = useFirestore()
  const [formValue, setFormValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isEditing, toggleIsEditing] = useBoolean(false)
  const [loading, setLoading] = useState(false)
  const [userName, setUsername] = useState("Loading...")
  const { status, data: user } = useUser()

  const { hasCopied, onCopy } = useClipboard(userName)
  useEffect(() => {
    if (!user) return
    const ref = doc(firestore, "users", user.uid)
    getDoc(ref).then((doc) => {
      if (doc.exists()) setUsername(doc.data().username)
      else setUsername("No Username")
    })
  }, [user, firestore])
  const onSubmit = async () => {
    if (!user) return

    // Create refs for both documents
    const userDoc = doc(firestore, `users/${user.uid}`)
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore)
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  //

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`)
        const exists = (await getDoc(ref)).exists()
        console.log("Firestore read executed!")
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    [debounce]
  )
  useEffect(() => {
    checkUsername(formValue)
  }, [formValue, checkUsername])

  return (
    <HStack
      onMouseLeave={(e) => {
        toggleIsEditing(false)
      }}>
      {isEditing ? (
        <>
          <FormControl isInvalid={!isValid}>
            <Input
              name="username"
              size="sm"
              variant="outline"
              placeholder="Username"
              autoComplete="off"
              type="other"
              value={formValue}
              onChange={onChange}
            />
            {!isValid ? (
              formValue.length > 1 && <FormHelperText>{formValue} is Available!</FormHelperText>
            ) : (
              <FormErrorMessage>{formValue} is taken.</FormErrorMessage>
            )}
          </FormControl>
          <Button
            type="submit"
            className="btn-green"
            disabled={!isValid}
            onClick={(e) => {
              e.preventDefault()
              onSubmit()
            }}>
            Choose
          </Button>
        </>
      ) : (
        <>
          <Tooltip hasArrow label={hasCopied ? "Copied Username!" : "Click to copy Username"}>
            <Text
              cursor="pointer"
              rounded="lg"
              transition="all 150ms ease-in-out"
              userSelect="none"
              onClick={onCopy}
              py={0.5}
              px={1}
              _hover={{ bg: "gray.800", color: "gray.100" }}>
              ID:{" " + userName}
            </Text>
          </Tooltip>
          <Tooltip hasArrow label="Edit Username">
            <IconButton aria-label="Edit" icon={<Icon icon="mdi:pencil" />} onClick={() => toggleIsEditing()} />
          </Tooltip>
        </>
      )}
    </HStack>
  )
}
