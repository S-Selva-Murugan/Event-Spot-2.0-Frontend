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
        <ProviderWrapper>
          <SessionProvider>
            {/* <AuthProvider {...cognitoAuthConfig}> */}
          {hideLayout ? (
            // ✅ No layout for login/signup
            children
          ) : (
            <>
              {/* ✅ Fixed Navbar */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1200,
                }}
              >
                <Navbar />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: navbarHeight,
                }}
              >
                {/* Sidebar */}
                {/* <Sidebar open={sidebarOpen} toggleDrawer={toggleSidebar} /> */}

                {/* Main content */}
                <main
                  style={{
                    flexGrow: 1,
                    // padding: "20px",
                    minHeight: `calc(100vh - ${navbarHeight}px)`,
                    boxSizing: "border-box",
                  }}
                >
                  {children}
                </main>

                <ChatbotWidget />
              </div>
            </>
          )}
          {/* </AuthProvider> */}
          </SessionProvider>
        </ProviderWrapper>
                  {/* <Footer /> */}
      </body>
    </html>
  );
}
