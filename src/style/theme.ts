import { createMuiTheme } from "@material-ui/core"

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  spacing: {
    unit: 20,
  },
  palette: {
    primary: {
      main: "#2c4b56",
      contrastText: "#fafafa",
    },
    secondary: {
      main: "#ffa800",
      contrastText: "#1a1a1a",
    },
  },
})

export default theme
