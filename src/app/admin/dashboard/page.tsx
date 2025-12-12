"use client";
import * as React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import ManageEvents from "../../components/ManageEvents";
import ManageUsers from "../../components/ManageUsers";
import CustomizeChatbot from "../../components/CustomizeChatbot";

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return <div role="tabpanel" hidden={value !== index} {...other}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

export default function AdminDashboard() {
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper elevation={3} sx={{ width: "85%", margin: "0 auto", borderRadius: 3, overflow: "hidden" }}>
        <Tabs value={value} onChange={handleChange} centered textColor="primary" indicatorColor="primary" sx={{ backgroundColor: "#f5f5f5", "& .MuiTab-root": { textTransform: "none", fontWeight: 600 } }}>
          <Tab label="Manage Events" />
          <Tab label="Manage Users" />
          <Tab label="Customize Chatbot" />
        </Tabs>

        <TabPanel value={value} index={0}><ManageEvents /></TabPanel>
        <TabPanel value={value} index={1}><ManageUsers /></TabPanel>
        <TabPanel value={value} index={2}><CustomizeChatbot /></TabPanel>
      </Paper>
    </Box>
  );
}