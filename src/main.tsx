import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import 'leaflet/dist/leaflet.css';

// Lag et enkelt MUI theme (kan tilpasses senere)
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // blå
    },
    secondary: {
      main: "#f50057", // rosa
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    //<React.StrictMode>  // kommenter ut i dev
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    //</React.StrictMode>
  );