import { createTheme } from "@mui/material/styles";
import tokens from "../design/tokens.json";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: tokens.color.bg.canvas.value,
      paper: tokens.color.bg.surface.value
    },
    text: {
      primary: tokens.color.text.primary.value,
      secondary: tokens.color.text.secondary.value
    },
    primary: {
      main: tokens.color.accent.primary.value
    },
    success: { main: tokens.color.state.success.value },
    warning: { main: tokens.color.state.warning.value },
    error: { main: tokens.color.state.error.value },
    info: { main: tokens.color.state.info.value },
    divider: tokens.color.border.subtle.value
  },
  typography: {
    fontFamily: tokens.font.family.sans.value,
    h1: { fontSize: tokens.font.size["3xl"].value, fontWeight: tokens.font.weight.semibold.value },
    h2: { fontSize: tokens.font.size["2xl"].value, fontWeight: tokens.font.weight.semibold.value },
    h3: { fontSize: tokens.font.size.xl.value, fontWeight: tokens.font.weight.medium.value },
    body1: { fontSize: tokens.font.size.md.value, lineHeight: tokens.font.lineHeight.normal.value },
    body2: { fontSize: tokens.font.size.sm.value, lineHeight: tokens.font.lineHeight.normal.value }
  },
  shape: {
    borderRadius: tokens.radius.lg.value
  },
  shadows: Array(25).fill("none") as any,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: tokens.shadow.sm.value,
          border: `1px solid ${tokens.color.border.subtle.value}`
        }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: tokens.radius.md.value,
          transitionDuration: `${tokens.motion.duration.normal.value}ms`
        },
        sizeMedium: { height: tokens.size.controlHeight.md.value },
        containedPrimary: {
          backgroundColor: tokens.color.accent.primary.value,
          "&:hover": { backgroundColor: tokens.color.accent.hover.value }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md.value,
          background: tokens.color.bg.surface.value
        },
        notchedOutline: {
          borderColor: tokens.color.border.default.value
        }
      }
    }
  }
});



