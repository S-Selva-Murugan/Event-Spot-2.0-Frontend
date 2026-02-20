import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    eventSpot: {
      gradients: {
        navbar: string;
      };
      surfaces: {
        page: string;
        panel: string;
      };
    };
  }

  interface ThemeOptions {
    eventSpot?: {
      gradients?: {
        navbar?: string;
      };
      surfaces?: {
        page?: string;
        panel?: string;
      };
    };
  }
}

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#0f6ac8",
      dark: "#0b4d93",
      light: "#2b8cff",
    },
    background: {
      default: "#d9e0e8",
      paper: "#f5f8fc",
    },
  },
  eventSpot: {
    gradients: {
      navbar: "linear-gradient(120deg, #0b4d93 0%, #0f6ac8 46%, #2b8cff 100%)",
    },
    surfaces: {
      page: "#d9e0e8",
      panel: "#f5f8fc",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#d9e0e8",
        },
      },
    },
  },
});

export default appTheme;
