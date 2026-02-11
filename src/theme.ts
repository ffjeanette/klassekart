import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4a90e2" },       // moderne blå
    secondary: { main: "#f5a623" },     // varm aksentfarge
    background: { default: "#f8f9fa", paper: "#fff" },
    text: { primary: "#222", secondary: "#555" },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: { fontWeight: 700, marginBottom: "1rem", fontSize: "1.8rem" },
    h6: { fontWeight: 600, marginBottom: "0.5rem" },
    subtitle1: { fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.9rem", lineHeight: 1.5 },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          padding: "8px 20px",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          minWidth: 160,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#4a90e2",
        },
      },
    },
  },
});
