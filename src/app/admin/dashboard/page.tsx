"use client";
import * as React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import ManageEvents from "../../components/ManageEvents";
import ManageUsers from "../../components/ManageUsers";
import CustomizeChatbot from "../../components/CustomizeChatbot";
import AdminAnalytics from "../../components/AdminAnalytics";

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mt: { xs: 1, sm: 1.5 },
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/bg_event1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.96,
          filter: "saturate(1.15) contrast(1.02)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(238,243,250,0.46) 0%, rgba(231,237,246,0.56) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: "100%", md: "90%", lg: "85%" },
          margin: "0 auto",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "rgba(245, 248, 252, 0.82)",
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(194, 205, 220, 0.6)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="primary"
          indicatorColor="primary"
          sx={{
            backgroundColor: "rgba(243, 246, 251, 0.88)",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: { xs: 48, sm: 56 },
              minWidth: { xs: 150, sm: 180 },
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: { xs: "flex-start", md: "center" },
            },
          }}
        >
          <Tab label="Manage Events" />
          <Tab label="Manage Users" />
          <Tab label="Customize Chatbot" />
          <Tab label="Analytics Dashboard" />
        </Tabs>

        <TabPanel value={value} index={0}><ManageEvents /></TabPanel>
        <TabPanel value={value} index={1}><ManageUsers /></TabPanel>
        <TabPanel value={value} index={2}><CustomizeChatbot /></TabPanel>
        <TabPanel value={value} index={3}><AdminAnalytics /></TabPanel>
      </Paper>
    </Box>
  );
}
