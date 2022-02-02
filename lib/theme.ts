import { extendTheme, SemanticValue, theme as baseTheme, ThemeConfig, } from "@chakra-ui/react"
const config: ThemeConfig = {
  initialColorMode: "dark", useSystemColorMode: false
}

const semanticTokens = {
  colors: {
    bg: {
      default: "gray.50",
      _dark: "gray.800",
    }
  }

}
const theme = extendTheme({ config, semanticTokens }, baseTheme)
export default theme