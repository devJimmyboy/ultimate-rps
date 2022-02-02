import React from "react"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { BufferGeometryNode, extend, useLoader, useThree } from "@react-three/fiber"
import { Font } from "three/examples/jsm/loaders/FontLoader"
import { Mesh } from "three"
extend({ TextGeometry })
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: BufferGeometryNode<TextGeometry, typeof TextGeometry>
    }
  }
}

interface Props {
  children: string
  color?: string
  transparent?: boolean
  font: Font
  size?: number
  height?: number
  curveSegments?: number
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelOffset?: number
  bevelSegments?: number
}

export default function TextMesh({ children, color = "white", transparent, ...props }: Props) {
  const ref = React.useRef<Mesh>()
  // const camera = useThree((state) => state.camera)

  return (
    <mesh ref={ref} castShadow receiveShadow position={[0, 5, 0]}>
      <textGeometry args={[children, props]} />
      <meshStandardMaterial color={color} transparent={transparent} />
    </mesh>
  )
}
