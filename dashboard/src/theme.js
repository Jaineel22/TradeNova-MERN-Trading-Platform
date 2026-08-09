import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E3C72", dark: "#142a52", light: "#4a63a0" },
    secondary: { main: "#00C896" },
    success: { main: "#1DB954" },
    error: { main: "#E5484D" },
    background: { default: "#F4F6FA", paper: "#FFFFFF" },
    text: { primary: "#101828", secondary: "#667085" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 3px rgba(16,24,40,0.08)", border: "1px solid #EAECF0" },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
