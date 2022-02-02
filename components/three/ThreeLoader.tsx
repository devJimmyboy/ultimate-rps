import { Spinner } from "@chakra-ui/react"
import { Html, useProgress } from "@react-three/drei"

export default function ThreeLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <Spinner />
      {progress} % loaded
    </Html>
  )
}
