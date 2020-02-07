export interface CustomTheme {
  palette: {
    primary: {
      main: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      contrastText: string;
    };
  };
}

const defaultTheme: CustomTheme = {
  palette: {
    primary: {
      main: "#2c4b56",
      contrastText: "#fafafa"
    },
    secondary: {
      main: "#ffa800",
      contrastText: "#1a1a1a"
    }
  }
};

export default defaultTheme;
