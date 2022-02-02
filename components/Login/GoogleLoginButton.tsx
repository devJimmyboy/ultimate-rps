import { Button, ButtonProps } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { NextPage } from "next"
import * as React from "react"

export const GoogleLoginButton = (props: ButtonProps): React.ReactElement => (
  <Button
    fontSize="sm"
    fontWeight="bold"
    size="lg"
    leftIcon={<Icon icon="ri:google-fill" fontSize="18px" />}
    iconSpacing="3"
    colorScheme="red"
    width="full"
    {...props}>
    Continue with Google
  </Button>
)
