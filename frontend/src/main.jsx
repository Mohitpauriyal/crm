import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Medical Green
    },
    secondary: {
      main: "#1565C0", // Hospital Blue
    },
    background: {
      default: "#F4F9F7",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);