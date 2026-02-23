"use client";
import * as React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const iconSx = {
  width: 42,
  height: 42,
  bgcolor: "rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.8)",
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.28)",
  },
};

export default function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 1.5,
        borderRadius: 2.5,
        px: { xs: 1.8, sm: 3.5 },
        py: { xs: 3, sm: 4 },
        background: "linear-gradient(180deg, #2d2f34 0%, #2a2c31 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Stack direction="row" spacing={1.2} justifyContent="center" sx={{ mb: 2 }}>
        <IconButton sx={iconSx}><FacebookRoundedIcon /></IconButton>
        <IconButton sx={iconSx}><XIcon /></IconButton>
        <IconButton sx={iconSx}><InstagramIcon /></IconButton>
        <IconButton sx={iconSx}><YouTubeIcon /></IconButton>
        <IconButton sx={iconSx}><PinterestIcon /></IconButton>
        <IconButton sx={iconSx}><LinkedInIcon /></IconButton>
      </Stack>

      <Typography
        align="center"
        sx={{ color: "rgba(255,255,255,0.48)", fontSize: { xs: "0.9rem", sm: "1.05rem" }, mb: 0.9 }}
      >
        Copyright {year} © EventSpot Entertainment Pvt. Ltd. All Rights Reserved.
      </Typography>

      <Typography
        align="center"
        sx={{ color: "rgba(255,255,255,0.34)", maxWidth: 1450, mx: "auto", fontSize: { xs: "0.88rem", sm: "1rem" } }}
      >
        The content and images used on this site are copyright protected and copyrights vests with the respective owners.
        The usage of the content and images on this website is intended to promote the works and no endorsement of the artist
        shall be implied. Unauthorized use is prohibited and punishable by law.
      </Typography>
    </Box>
  );
}
