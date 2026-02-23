import AllEvents from "../components/AllEvents"
import FeaturedMap from "../components/FeaturedMap";
import { Box } from "@mui/material";
import BannerCarousel from "../components/BannerCarousel";
import DashboardFooter from "../components/DashboardFooter";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.5 },
        pt: { xs: 0.9, sm: 1.2 },
        pb: { xs: 1, sm: 1.4 },
        height: "calc(100dvh - 64px)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 1.1,
      }}
    >
      <Box sx={{ pb: 0.4 }}>
        <BannerCarousel />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { xs: "auto", md: "64vh" },
          width: "100%",
          minHeight: { xs: "auto", md: 530 },
          gap: { xs: 1, md: 1.2 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: 390, sm: 450, md: "100%" },
            borderRight: { md: "1px solid #d7e0ec" },
            borderRadius: 3,
            overflow: "hidden",
            boxSizing: "border-box",
            background: "rgba(244,248,253,0.82)",
            border: "1px solid rgba(173, 188, 208, 0.6)",
          }}
        >
          <FeaturedMap/>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: 520, sm: 610, md: "100%" },
            minHeight: 0,
            overflow: "auto",
            borderRadius: 3,
            border: "1px solid rgba(173, 188, 208, 0.6)",
            background: "rgba(244,248,253,0.82)",
          }}
        >
          <AllEvents/>
        </Box>
      </Box>

      <DashboardFooter />
    </Box>
  );
}
