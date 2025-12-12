"use client";

import * as React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import OrganisingEvents from "../components/OrganisingEvents";
import EventBookings from "../components/EventBookings";

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDashboard() {
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          width: "85%",
          margin: "0 auto",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            backgroundColor: "#f5f5f5",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          }}
        >
          <Tab label="Organising Events" />
          <Tab label="Event Bookings" />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={value} index={0}>
          <OrganisingEvents />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EventBookings />
        </TabPanel>
      </Paper>
    </Box>
  );
}
