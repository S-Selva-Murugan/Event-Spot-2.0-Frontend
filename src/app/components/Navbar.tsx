"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deepPurple } from "@mui/material/colors";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { RootState, AppDispatch } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Navbar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const authState = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    router.push("/login");
  };

  const dashboardHref = authState.role === "admin" ? "/admin/dashboard" : "/dashboard";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: theme.eventSpot.gradients.navbar }}>
        <Toolbar>
          {/* Brand */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            EventSpot
          </Typography>

          {/* Auth state check */}
          {!authState.isAuthenticated ? (
            <Button
              component={Link}
              href="/login"
              color={pathname === "/login" ? "secondary" : "inherit"}
              sx={{
                textTransform: "none",
                fontWeight: pathname === "/login" ? "bold" : "normal",
                mr: 2,
              }}
            >
              Login
            </Button>
          ) : (
            <>
              <Typography
                component={Link}
                href={dashboardHref}
                sx={{
                  color: "inherit",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "text-shadow 0.2s ease, opacity 0.2s ease",
                  "&:hover": {
                    textDecoration: "none",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.65)",
                    opacity: 0.95,
                  },
                }}
              >
                Dashboard
              </Typography>

              {authState.role !== "admin" && (
                <>
                  <Typography sx={{ mx: 1, opacity: 0.8 }}>|</Typography>
                  <Typography
                    component={Link}
                    href="/profile"
                    sx={{
                      color: "inherit",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "text-shadow 0.2s ease, opacity 0.2s ease",
                      "&:hover": {
                        textDecoration: "none",
                        textShadow: "0 0 10px rgba(255, 255, 255, 0.65)",
                        opacity: 0.95,
                      },
                    }}
                  >
                    Profile
                  </Typography>

                  <Typography sx={{ mx: 1, opacity: 0.8 }}>|</Typography>
                  <Typography
                    component={Link}
                    href="/otpVerification"
                    sx={{
                      color: "inherit",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "text-shadow 0.2s ease, opacity 0.2s ease",
                      "&:hover": {
                        textDecoration: "none",
                        textShadow: "0 0 10px rgba(255, 255, 255, 0.65)",
                        opacity: 0.95,
                      },
                    }}
                  >
                    List Your Events
                  </Typography>
                </>
              )}

              {/* Avatar */}
              <IconButton onClick={handleClick} sx={{ p: 0, ml: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: deepPurple[500],
                    width: 36,
                    height: 36,
                    fontSize: 16,
                  }}
                >
                  {getInitials(authState.name || "U")}
                </Avatar>
              </IconButton>

              {/* Popover */}
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: { p: 2, width: 280, maxWidth: "90vw", borderRadius: 2 },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {authState.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                  }}
                >
                  {authState.email}
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Logout
                </Button>
              </Popover>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
