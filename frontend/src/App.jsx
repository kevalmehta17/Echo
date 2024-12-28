import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./scenes/homePage/index.jsx";
import LoginPage from "./scenes/loginPage/index.jsx";
import ProfilePage from "./scenes/profilePage/index.jsx";
import { useSelector } from "react-redux";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme.js";
import { useMemo } from "react";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
