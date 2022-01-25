import { Box } from "@mantine/core"
import React, { ReactElement } from "react"
import Particles from "react-tsparticles"
import { Container, Engine } from "tsparticles"

interface Props {}

export default function Background({}: Props): ReactElement {
  const particlesInit = async (main: Engine) => {
    console.log(main)

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  }
  const particlesLoaded = async (container: Container) => {
    console.log(container)
  }

  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[2],
        zIndex: -1,
      })}>
      <Particles id="tsparticles" url="/particles.json" init={particlesInit} loaded={particlesLoaded} />
    </Box>
  )
}
