"use client";
import React, { useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: "fixed", top: 10, right: 10 }}>
        <IconButton
          color="inherit"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </div>
      {children}
    </ThemeProvider>
  );
}
