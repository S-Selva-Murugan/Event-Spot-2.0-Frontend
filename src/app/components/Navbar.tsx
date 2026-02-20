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

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

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

          {/* “List Your Event” button for logged-in non-admin users */}
          {authState.isAuthenticated && authState.role !== "admin" && (
            <Button
              component={Link}
              href="/otpVerification"
              variant="contained"
              color="secondary"
              sx={{
                textTransform: "none",
                mr: 2,
                fontWeight: "bold",
                borderRadius: "20px",
                px: 3,
                py: 1,
                backgroundColor: "#fff",
                color: "primary.main",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              List Your Event
            </Button>
          )}

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
              {/* Avatar */}
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
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
                  sx: { p: 2, width: 220, borderRadius: 2 },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {authState.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {authState.email}
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Button
                  variant="text"
                  fullWidth
                  onClick={handleProfile}
                  sx={{
                    mb: 1,
                    color: "primary.main",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(15, 106, 200, 0.08)",
                    },
                  }}
                >
                  Profile
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
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
