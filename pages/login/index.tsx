import { Center } from "@chakra-ui/react"
import type { NextPage } from "next"
import Login from "../../components/Login"

interface Props {}

const Page: NextPage = ({}: Props) => {
  return (
    <Center w="100%" h="100%">
      <Login />
    </Center>
  )
}

export default Page
