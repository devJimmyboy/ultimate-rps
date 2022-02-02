import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react"
import { NextPage } from "next"

import * as React from "react"

export const Card: NextPage<BoxProps> = (props) => (
  <Box bg={useColorModeValue("white", "gray.800")} rounded={{ md: "2xl" }} p="8" {...props} />
)
