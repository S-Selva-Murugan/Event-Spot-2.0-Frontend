"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatbotWidget from "./components/ChatbotWidget";
import { ProviderWrapper } from "./redux/provideWrapper"; // ✅ import Provider
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import appTheme from "@/theme/appTheme";
import Footer from "./components/Footer";
// import { AuthProvider } from "react-oidc-context";

// const drawerWidthOpen = 50;
// const drawerWidthClosed = 150;
const navbarHeight = 64; // height of your navbar

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/signup";

  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_2yusphQI2",
  client_id: "5s6u570jne7ga6544mo87ms18o",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email profile",
};


  // ✅ Wrap entire layout inside Redux ProviderWrapper
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <ProviderWrapper>
            <SessionProvider>
              {/* <AuthProvider {...cognitoAuthConfig}> */}
              {hideLayout ? (
                children
              ) : (
                <Box sx={{ minHeight: "100vh", bgcolor: (theme) => theme.eventSpot.surfaces.page }}>
                  <Box
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1200,
                    }}
                  >
                    <Navbar />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: `${navbarHeight}px`,
                    }}
                  >
                    {/* Sidebar */}
                    {/* <Sidebar open={sidebarOpen} toggleDrawer={toggleSidebar} /> */}

                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        minHeight: `calc(100vh - ${navbarHeight}px)`,
                        boxSizing: "border-box",
                        bgcolor: (theme) => theme.eventSpot.surfaces.page,
                      }}
                    >
                      {children}
                    </Box>

                    <ChatbotWidget />
                  </Box>
                </Box>
              )}
              {/* </AuthProvider> */}
            </SessionProvider>
          </ProviderWrapper>
        </ThemeProvider>
                  {/* <Footer /> */}
      </body>
    </html>
  );
}
