
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import AppThemeProvider from "@/providers/ThemeProvider"; 
import { CssBaseline } from "@mui/material";

export const metadata = {
  title: "Dynamic Data Table",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
        
          <AppThemeProvider>
            <CssBaseline />
            {children}
          </AppThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;

