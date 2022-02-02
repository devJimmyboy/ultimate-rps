import {
  Button,
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HTMLChakraProps,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { NextPage } from "next"
import * as React from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { SubmitHandler, useForm, useFormState } from "react-hook-form"
import { useBoolean, useDebounce } from "react-use"
import { Icon } from "@iconify/react"
import { useFirestore } from "reactfire"
import { doc, getDoc } from "firebase/firestore"
import { debounce } from "lodash"

interface Props {
  onDone: SubmitHandler<Values>
}

interface Values {
  email: string
  username: string
  password: string
}

const schema = yup
  .object({
    email: yup.string().email("Not an Email...").required("Email is required"),
    username: yup
      .string()
      .min(3, "3 Character Minimum.")
      .lowercase("Username must be lowercase.")
      .notOneOf(["admin", "jimmyboy", "fuck"], "no. nice try.")
      .notRequired(),
    password: yup.string().min(6, "6 Character Minimum.").required("Password is required").trim(),
  })
  .required()

export const EmailLoginForm: NextPage<HTMLChakraProps<"form"> & Props> = ({ onDone, ...props }) => {
  const firestore = useFirestore()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", username: "" },
  })

  const [shownPassword, toggleShownPassword] = useBoolean(false)
  const [isValidEmail, toggleIsValidEmail] = useBoolean(false)

  const [exists, setExists] = useBoolean(false)

  React.useEffect(() => {
    const sub = watch((values, { name, value, type }) => {
      if (name !== "email") return
      toggleIsValidEmail(schema.fields.email.isValidSync(values.email))
      if (values.email && values.email !== "")
        fetch(`api/user/exists?email=${encodeURIComponent(values.email)}`, { method: "GET" })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response:", data, values.email)
            setExists(data.exists as boolean)
          })
    })
    return () => sub.unsubscribe()
  }, [])
  React.useEffect(() => console.log("Email is", isValidEmail ? "valid" : "invalid"), [isValidEmail])

  const checkUsername = React.useCallback(
    debounce(async (username: string) => {
      const ref = doc(firestore, `usernames/${username}`)
      const exists = (await getDoc(ref)).exists()
      console.log("Firestore read executed!")
      return !exists
    }, 500),
    [firestore]
  )
  return (
    <chakra.form width="full" {...props} onSubmit={handleSubmit(onDone)}>
      <VStack align="center" gap={5}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel
            htmlFor="email"
            fontWeight="medium"
            fontSize="sm"
            mb="2"
            textAlign="center"
            color={useColorModeValue("gray.600", "gray.400")}>
            or continue with email
          </FormLabel>
          <Input
            id="email"
            placeholder="Email address"
            _placeholder={{ color: useColorModeValue("gray.600", "gray.400") }}
            {...register("email", {})}
          />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>
        <Collapse style={{ width: "100%" }} in={isValidEmail} animateOpacity>
          <VStack align="center" gap={5}>
            <FormControl style={{ display: exists ? "none" : "unset" }} isInvalid={!!errors.username}>
              <Input
                id="username"
                placeholder="Username"
                _placeholder={{ color: useColorModeValue("gray.600", "gray.400") }}
                {...register("username", { validate: { isAvailable: checkUsername } })}
              />
              <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  pr="1.3em"
                  id="password"
                  type={shownPassword ? "text" : "password"}
                  placeholder="Password"
                  _placeholder={{ color: useColorModeValue("gray.600", "gray.400") }}
                  {...register("password")}
                />
                <InputRightElement>
                  <IconButton
                    w="1.3em"
                    size="sm"
                    icon={<Icon fontSize={20} icon={shownPassword ? "mdi:eye" : "mdi:eye-off"} />}
                    aria-label="Show password"
                    onClick={toggleShownPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </Collapse>
      </VStack>
      <Button
        mt="3"
        isFullWidth
        fontSize="sm"
        fontWeight="bold"
        colorScheme="gray"
        isLoading={isSubmitting}
        type="submit">
        Continue
      </Button>
    </chakra.form>
  )
}
