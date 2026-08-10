import { createTheme } from "@mui/material/styles";

// TradeNova design tokens - a restrained fintech palette. Navy anchors trust/
// authority, teal is the brand accent, green/red carry financial semantics
// (profit/buy vs loss/sell) and are never the only signal (always paired with
// a +/- sign and an up/down icon so colour isn't load-bearing on its own).
const colors = {
  navy900: "#0B1626",
  navy800: "#0F1B33",
  navy700: "#152648",
  primary: "#1E3C72",
  primaryDark: "#142a52",
  primaryLight: "#4a63a0",
  teal: "#00C896",
  tealDark: "#00A67D",
  green: "#1DB954",
  greenDark: "#188C40",
  red: "#E5484D",
  redDark: "#C93338",
  amber: "#F59E0B",
  slate900: "#101828",
  slate600: "#475467",
  slate500: "#667085",
  slate300: "#D0D5DD",
  slate200: "#E4E7EC",
  slate100: "#EAECF0",
  slate50: "#F8F9FB",
  appBg: "#F4F6FA",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: colors.primary, dark: colors.primaryDark, light: colors.primaryLight, contrastText: "#fff" },
    secondary: { main: colors.teal, dark: colors.tealDark, contrastText: "#fff" },
    success: { main: colors.green, dark: colors.greenDark, contrastText: "#fff" },
    error: { main: colors.red, dark: colors.redDark, contrastText: "#fff" },
    warning: { main: colors.amber, contrastText: "#1A1300" },
    info: { main: colors.primaryLight },
    background: { default: colors.appBg, paper: "#FFFFFF" },
    text: { primary: colors.slate900, secondary: colors.slate500, disabled: colors.slate300 },
    divider: colors.slate100,
    grey: {
      50: colors.slate50,
      100: colors.slate100,
      200: colors.slate200,
      300: colors.slate300,
      600: colors.slate600,
      900: colors.slate900,
    },
  },
  custom: {
    navy: colors.navy800,
    navyDark: colors.navy900,
    navyRaised: colors.navy700,
    positive: colors.green,
    negative: colors.red,
  },
  shape: { borderRadius: 10 },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.5 },
    h3: { fontWeight: 700, letterSpacing: -0.25, fontSize: "2.25rem" },
    h4: { fontWeight: 700, letterSpacing: -0.25, fontSize: "1.75rem" },
    h5: { fontWeight: 700, fontSize: "1.375rem", letterSpacing: -0.2 },
    h6: { fontWeight: 600, fontSize: "1.0625rem" },
    subtitle1: { fontWeight: 600, fontSize: "0.9375rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem", color: colors.slate500 },
    body1: { fontSize: "0.9375rem" },
    body2: { fontSize: "0.8125rem" },
    caption: { fontSize: "0.75rem" },
    overline: { fontSize: "0.6875rem", fontWeight: 700, letterSpacing: 0.8 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shadows: [
    "none",
    "0 1px 2px rgba(16,24,40,0.06)",
    "0 1px 3px rgba(16,24,40,0.08)",
    "0 2px 6px rgba(16,24,40,0.08)",
    "0 4px 10px rgba(16,24,40,0.09)",
    "0 4px 10px rgba(16,24,40,0.09)",
    "0 6px 16px rgba(16,24,40,0.10)",
    "0 6px 16px rgba(16,24,40,0.10)",
    "0 8px 20px rgba(16,24,40,0.11)",
    "0 8px 20px rgba(16,24,40,0.11)",
    "0 10px 24px rgba(16,24,40,0.12)",
    "0 10px 24px rgba(16,24,40,0.12)",
    "0 12px 28px rgba(16,24,40,0.13)",
    "0 12px 28px rgba(16,24,40,0.13)",
    "0 14px 32px rgba(16,24,40,0.14)",
    "0 14px 32px rgba(16,24,40,0.14)",
    "0 16px 36px rgba(16,24,40,0.15)",
    "0 16px 36px rgba(16,24,40,0.15)",
    "0 18px 40px rgba(16,24,40,0.16)",
    "0 18px 40px rgba(16,24,40,0.16)",
    "0 20px 44px rgba(16,24,40,0.17)",
    "0 20px 44px rgba(16,24,40,0.17)",
    "0 22px 48px rgba(16,24,40,0.18)",
    "0 22px 48px rgba(16,24,40,0.18)",
    "0 24px 52px rgba(16,24,40,0.19)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": { boxSizing: "border-box" },
        "::selection": { background: "rgba(0,200,150,0.25)" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          border: `1px solid ${colors.slate100}`,
          backgroundImage: "none",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: 20, "&:last-child": { paddingBottom: 20 } } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingTop: 8, paddingBottom: 8 },
        sizeSmall: { paddingTop: 5, paddingBottom: 5 },
        containedPrimary: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
        sizeSmall: { fontSize: "0.6875rem", height: 22 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: "#fff" },
        notchedOutline: { borderColor: colors.slate200 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: colors.slate100, padding: "12px 16px" },
        head: {
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: colors.slate500,
          backgroundColor: colors.slate50,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: "none" },
          "&.MuiTableRow-hover:hover": { backgroundColor: colors.slate50 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, boxShadow: "0 24px 60px rgba(16,24,40,0.22)" },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: colors.navy900, fontSize: "0.75rem", borderRadius: 6 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderColor: colors.slate200,
          "&.Mui-selected": {
            backgroundColor: colors.primary,
            color: "#fff",
            "&:hover": { backgroundColor: colors.primaryDark },
          },
        },
      },
    },
  },
});

export default theme;
