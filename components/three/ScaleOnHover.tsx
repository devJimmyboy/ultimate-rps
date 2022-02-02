import * as THREE from "three"
import { useSpring, animated, config } from "@react-spring/three"
import React, { useRef } from "react"
import { useBoolean } from "react-use"

interface Props {}

export default function ScaleOnHover({ children, ...props }: JSX.IntrinsicElements["group"] & Props) {
  const ref = useRef<THREE.Group>()
  const [hovering, setHovering] = useBoolean(false)

  const { scale } = useSpring({ scale: hovering ? 1.2 : 1, config: config.wobbly })

  return (
    <animated.group
      ref={ref}
      scale={scale}
      onPointerOver={() => setHovering()}
      onPointerOut={() => setHovering()}
      {...props}>
      {children}
    </animated.group>
  )
}
