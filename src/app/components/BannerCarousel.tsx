"use client";
import * as React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    image: "/bg_event1.jpg",
    title: "Discover Trending Events",
    subtitle: "Handpicked experiences across music, workshops, and community.",
  },
  {
    image: "/support.jpg",
    title: "Plan Your Weekend Better",
    subtitle: "Find nearby events instantly and book in minutes.",
  },
  {
    image: "/signup.jpg",
    title: "From Local to Live",
    subtitle: "Explore verified events with real-time map context.",
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const next = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 200, sm: 240, md: 290 },
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(174, 191, 214, 0.55)",
        boxShadow: "0 14px 26px rgba(25, 53, 90, 0.22)",
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={slide.image}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === activeIndex ? 1 : 0,
            transition: "opacity 520ms ease",
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(16,46,82,0.72) 0%, rgba(22,76,136,0.36) 55%, rgba(20,89,171,0.2) 100%)",
        }}
      />

      <Box sx={{ position: "absolute", inset: 0, p: { xs: 1.8, sm: 2.6, md: 3.2 } }}>
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2rem" } }}>
          {slides[activeIndex].title}
        </Typography>
        <Typography sx={{ mt: 0.5, color: "rgba(246,250,255,0.9)", fontSize: { xs: "0.86rem", sm: "1rem", md: "1.08rem" }, maxWidth: 560 }}>
          {slides[activeIndex].subtitle}
        </Typography>
      </Box>

      <IconButton
        onClick={prev}
        size="small"
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#fff",
          bgcolor: "rgba(10, 27, 51, 0.36)",
          "&:hover": { bgcolor: "rgba(10, 27, 51, 0.5)" },
        }}
      >
        <ChevronLeftRoundedIcon />
      </IconButton>

      <IconButton
        onClick={next}
        size="small"
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#fff",
          bgcolor: "rgba(10, 27, 51, 0.36)",
          "&:hover": { bgcolor: "rgba(10, 27, 51, 0.5)" },
        }}
      >
        <ChevronRightRoundedIcon />
      </IconButton>

      <Stack direction="row" spacing={0.6} sx={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)" }}>
        {slides.map((_, index) => (
          <Box
            key={`dot-${index}`}
            sx={{
              width: index === activeIndex ? 18 : 7,
              height: 7,
              borderRadius: 10,
              bgcolor: index === activeIndex ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
              transition: "all 220ms ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
